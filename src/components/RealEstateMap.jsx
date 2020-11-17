import React, { useEffect, useState } from 'react'
import GoogleMapReact from 'google-map-react'
import MapMarker from './MapMarker'
import { GOOGLE_MAPS } from '../config/settings'
import { Box } from '@material-ui/core'

const RealEstateMap = (props) => {

    const [center, setCenter] = useState([10, 10]);
    useEffect(() => {
        const propsCenter = [...props.center];
        if (!propsCenter.some(isNaN)) {
            setCenter(propsCenter);
        }
    }, [props.center])

    return (
        <Box m={3}>
            <div style={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                    //bootstrapURLKeys={{ key: GOOGLE_MAPS.API_KEY }}
                    defaultCenter={{ lat: 10, lng: 10 }}
                    center={center}
                    defaultZoom={11}
                >
                    <MapMarker
                        text={'Here'}
                    />
                </GoogleMapReact>
            </div>
        </Box>
    );
}

export default RealEstateMap;
