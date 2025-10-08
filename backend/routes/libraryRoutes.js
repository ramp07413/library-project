const Router = require('express');
const { registerLibrary } = require('../controllers/library.Controller');

const router = Router();

// router.get("/all", allLibraries)

router.post("/register", registerLibrary)

// router.put("/:id", updateLibrary)

// router.delete(":/id", deleteLibrary)


module.exports  = router
