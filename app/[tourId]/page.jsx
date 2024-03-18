import React from 'react'
import Navigation from '../../components/Navigation'
import EditTour from '../../components/EditTour'
import EditDetail from '../../components/EditDetail'

function page(tourId) {
    console.log('tourId data', tourId)
    let params = tourId.params.tourId
  return (
    <div className='w-full h-[100vh] overflow-y-auto'>
        <Navigation editTour={<EditTour id={params}/>} EditDetail={<EditDetail tourDetailId={params}/>}  />
        
    </div>
  )
}

export default page