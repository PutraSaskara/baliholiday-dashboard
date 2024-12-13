import ListTours from '../components/ListTours'
import ListArticle from '../components/ListArticle'
import NavList from '../components/NavList'
import DestinationList from "../components/ListDestinations";
import ListAreas from "@/components/ListAreas"

export default function Home() {
  return (
    <div className="w-[100%] px-5 overflow-y-auto">
      <NavList ListArticle={<ListArticle/>} ListTour={<ListTours/>} DestinationsList={<DestinationList/>} ListArea={<ListAreas/>}/>
    </div>
  );
}
