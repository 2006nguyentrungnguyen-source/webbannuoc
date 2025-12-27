const { requireAuth, requireRole } = require("../middlewares/auth");

router.post("/", requireAuth, requireRole("admin"), controller.create);
router.patch("/:id", requireAuth, requireRole("admin"), controller.update);
router.delete("/:id", requireAuth, requireRole("admin"), controller.remove);