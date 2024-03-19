import React from 'react'
import Navigation from '../../components/Navigation'
import EditTour from '../../components/EditTour'
import EditDetail from '../../components/EditDetail'
import EditDesc from '../../components/EditDesc'
import EditPlan from '../../components/EditPlan'
import EditImage from '../../components/EditImage'
import EditOther from '../../components/EditOther'
function page(tourId) {
    console.log('tourId data', tourId)
    let params = tourId.params.tourId
  return (
    <div className='w-full h-[100vh] overflow-y-auto'>
        <Navigation editTour={<EditTour id={params}/>} EditDetail={<EditDetail tourDetailId={params}/>}  EditDesc={<EditDesc tourId={params} />} editPlan={<EditPlan tourId={params} />} editImage={<EditImage Id={params} />} editOther={<EditOther Id={params} />}/>
        
    </div>
  )
}

export default page