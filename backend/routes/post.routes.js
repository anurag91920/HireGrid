import { Router } from "express";
import { activeCheck, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPosts,  toggle_like } from "../controllers/post.controller.js";
import { commentPost } from "../controllers/user.controller.js";
import multer from 'multer';




const router = Router();

const storage = multer.diskStorage({
  destination:(req, res, cb)=>{
    cb(null, 'uploads/')
  },
  filename:(req, file,cb)=>{
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage});  // this is the middleware that will be used to upload the file


router.route('/').get(activeCheck)


router.route("/post").post(upload.single("media"), createPost)
router.route('/posts').get(getAllPosts)
router.route('/delete_post').post(deletePost)
router.route('/comment').post(commentPost)
router.route('/get_comments').get(get_comments_by_post);

router.route('/delete_comment').delete(delete_comment_of_user);

router.route('/increment_post_like').post(toggle_like);





export default router;