import ListTours from '../components/ListTours'
import ListArticle from '../components/ListArticle'
import NavList from '../components/NavList'

export default function Home() {
  return (
    <div className="w-[100%] px-5 overflow-y-auto">
      <NavList ListArticle={<ListArticle/>} ListTour={<ListTours/>}/>
        
        
    </div>
  );
}
