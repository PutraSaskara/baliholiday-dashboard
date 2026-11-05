import Navigation2 from "../../../components/Navigation2"
import EditSingleArticle from '../../../components/EditSingleArticle'
import EditArticleParagraf from '../../../components/EditArticleParagraf'
import EditArticleImage from '../../../components/EditArticleImage'

async function page({ params }) {
    const { blogId } = await params
  return (
    <div className="w-full">
        <Navigation2 editSingleArticle={<EditSingleArticle id={blogId} />} EditParagraph={<EditArticleParagraf id={blogId} />} EditImage={<EditArticleImage Id={blogId} />} />
    </div>
  )
}

export default page