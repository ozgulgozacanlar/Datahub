import React from 'react'
import { useEffect, useState } from 'react';
import './QlikObject.css';
import { Loader } from '@/components';


export default function QlikObject({ app, objectId, elementId }) {
    const [isLoaded, setIsLoaded] = useState(false);
    function renderQlikObject(objectId, elementId) {
        if (app) {
            app.getObject(elementId, objectId).then((model) => {
                setIsLoaded(true);

            }).catch((error) => {
                console.error('Error loading Qlik object:', error);
                setIsLoaded(false);  // Eğer hata olursa, isLoaded durumunu false yap

            });;
        }
    }
    useEffect(() => {
        renderQlikObject(objectId, elementId);
    }, [app, objectId, elementId]); // app, qlikId veya elementId değiştiğinde çağır

    return (

        <div id={elementId} className="qvobject" style={{ display: isLoaded ? 'block' : 'none' }}></div>

    )
}

