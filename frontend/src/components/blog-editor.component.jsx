import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"



// Define a functional component named BlogEditor
const BlogEditor = () => {
    return (
     <>
       <nav className="navbar" >
        <Link to="/" className="flex-none w-10">
           <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
           New Blog
        </p>

        <div className="flex gap-4 ml-auto">
            <button className="btn-dark py-2">
                Publish
            </button>

            <button className="btn-light py-2">
                Save Draft
            </button>
        </div>

       </nav>

       <AnimationWrapper>
        <section>
            <div className="mx-auto max-w-[900px] w-full">
                 <div className="relative aspect-video bg-white hover:opacity-80 border-4 border-grey">
                     <label className="uploadBanner">
                        <img
                        src={defaultBanner}
                        /> 
                        <input
                          id="upoadBanner"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          hidden
                          />

                     </label>
                 </div>

            </div>
        </section>
       </AnimationWrapper>
    </>
    );
  };
  
  // Export the BlogEditor component as the default export
  export default BlogEditor;
