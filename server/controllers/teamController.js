import Team from "../models/Team.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* =========================
   CREATE TEAM
========================= */
export const createTeam = async (req, res) => {
  try {
    const { hackathonName, problemStatement, deadline, roles } = req.body;

    if (!hackathonName || !problemStatement || !deadline || !roles?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const formattedRoles = roles.map((role) => ({
      roleName: role.roleName,
      requiredCount: Number(role.requiredCount),
    }));

    const team = await Team.create({
      hackathonName,
      problemStatement,
      deadline,
      roles: formattedRoles,
      leader: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      role: "leader",
      $inc: { experiencePoints: 1 },
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Create Team Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET TEAMS
========================= */
export const getTeams = async (req, res) => {
  try {
    const { search = "", role = "", department = "" } = req.query;

    let teams = await Team.find()
      .populate("leader", "fullName email department year")
      .sort({ createdAt: -1 });

    if (search) {
      teams = teams.filter(
        (team) =>
          team.hackathonName.toLowerCase().includes(search.toLowerCase()) ||
          team.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
          team.leader?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      teams = teams.filter((team) =>
        team.roles.some((r) =>
          r.roleName.toLowerCase().includes(role.toLowerCase())
        )
      );
    }

    if (department) {
      teams = teams.filter((team) =>
        team.leader?.department?.toLowerCase().includes(department.toLowerCase())
      );
    }

    const updatedTeams = await Promise.all(
      teams.map(async (team) => {
        const teamObj = team.toObject();

        teamObj.roles = await Promise.all(
          team.roles.map(async (role) => {
            const acceptedCount = await Application.countDocuments({
              team: team._id,
              roleApplied: role.roleName,
              status: "accepted",
            });

            return {
              ...role.toObject(),
              filledCount: acceptedCount,
            };
          })
        );

        return teamObj;
      })
    );

    res.status(200).json(updatedTeams);
  } catch (error) {
    console.error("Get Teams Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   APPLY TO ROLE
========================= */
export const applyToRole = async (req, res) => {
  try {
    const { teamId } = req.params;
    const roleApplied = req.body.roleApplied || req.body.role;

    if (!roleApplied) {
      return res.status(400).json({ message: "Role is required" });
    }

    const team = await Team.findById(teamId).populate("leader", "fullName");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: "You cannot apply to your own team" });
    }

    const selectedRole = team.roles.find((r) => r.roleName === roleApplied);
    if (!selectedRole) {
      return res.status(400).json({ message: "Selected role does not exist" });
    }

    const existing = await Application.findOne({
      user: req.user.id,
      team: teamId,
      roleApplied,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied for this role" });
    }

    const acceptedCount = await Application.countDocuments({
      team: teamId,
      roleApplied,
      status: "accepted",
    });

    if (acceptedCount >= selectedRole.requiredCount) {
      return res.status(400).json({ message: "This role is already full" });
    }

    const application = await Application.create({
      user: req.user.id,
      team: teamId,
      roleApplied,
      status: "pending",
    });

    const applicant = await User.findById(req.user.id);

    await Notification.create({
      user: team.leader._id,
      message: `${applicant.fullName} applied for ${roleApplied} in ${team.hackathonName}`,
      type: "application",
      link: "/manage",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply To Role Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already applied for this role" });
    }
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET LEADER APPLICATIONS
========================= */
export const getLeaderApplications = async (req, res) => {
  try {
    console.log("Logged in Leader ID:", req.user.id);

    const teams = await Team.find({ leader: req.user.id });
    console.log("Leader Teams:", teams);

    const teamIds = teams.map((team) => team._id);
    console.log("Leader Team IDs:", teamIds);

    const applications = await Application.find({
      team: { $in: teamIds },
    })
      .populate(
        "user",
        "fullName email department year github linkedin experiencePoints"
      )
      .populate("team", "hackathonName roles leader")
      .sort({ createdAt: -1 });

    console.log("Applications Found:", applications);

    res.status(200).json(applications);
  } catch (error) {
    console.error("Get Leader Applications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE APPLICATION STATUS
========================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { appId } = req.params;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(appId).populate("team");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to manage this application",
      });
    }

    const roleConfig = application.team.roles.find(
      (r) => r.roleName === application.roleApplied
    );

    if (!roleConfig) {
      return res.status(400).json({ message: "Role config not found" });
    }

    if (status === "accepted") {
      const acceptedCount = await Application.countDocuments({
        team: application.team._id,
        roleApplied: application.roleApplied,
        status: "accepted",
      });

      if (
        acceptedCount >= roleConfig.requiredCount &&
        application.status !== "accepted"
      ) {
        return res.status(400).json({ message: "This role is already full" });
      }
    }

    if (application.status === "accepted" && status === "accepted") {
      return res.status(400).json({ message: "Application already accepted" });
    }

    const oldStatus = application.status;
    application.status = status;
    await application.save();

    await Notification.create({
      user: application.user,
      message: `Your application for ${application.roleApplied} in ${application.team.hackathonName} was ${status}`,
      type: "status",
      link: "/profile",
    });

    if (oldStatus !== "accepted" && status === "accepted") {
      await User.findByIdAndUpdate(application.user, {
        $inc: { experiencePoints: 1 },
      });
    }

    res.status(200).json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};