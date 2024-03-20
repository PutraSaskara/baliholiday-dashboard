import Navigation2 from "../../../components/Navigation2"
import EditSingleArticle from '../../../components/EditSingleArticle'
import EditArticleParagraf from '../../../components/EditArticleParagraf'
import EditArticleImage from '../../../components/EditArticleImage'

function page(blogId) {
  console.log('tourId data', blogId)
    let params = blogId.params.blogId
  return (
    <div className="w-full">
        <Navigation2 editSingleArticle={<EditSingleArticle id={params} />} EditParagraph={<EditArticleParagraf id={params} />} EditImage={<EditArticleImage Id={params} />} />
    </div>
  )
}

export default page