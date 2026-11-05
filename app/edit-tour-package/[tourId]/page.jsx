import React from 'react'
import Navigation from '../../../components/Navigation'
import EditTour from '../../../components/EditTour'
import EditDetail from '../../../components/EditDetail'
import EditDesc from '../../../components/EditDesc'
import EditPlan from '../../../components/EditPlan'
import EditImage from '../../../components/EditImage'
import EditOther from '../../../components/EditOther'
async function page({ params }) {
    const { tourId } = await params
  return (
    <div className='w-full h-[100vh] overflow-y-auto'>
        <Navigation editTour={<EditTour id={tourId}/>} EditDetail={<EditDetail tourDetailId={tourId}/>}  EditDesc={<EditDesc tourId={tourId} />} editPlan={<EditPlan tourId={tourId} />} editImage={<EditImage Id={tourId} />} editOther={<EditOther Id={tourId} />}/>
        
    </div>
  )
}

export default page