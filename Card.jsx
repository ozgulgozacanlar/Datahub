import React from 'react'
import { useEffect, useState } from 'react';
import { getObjectData } from '@/util/qlikConnection';
import { TargetIco } from '@/assets/svg';

export default function Card({ app, objectId, title }) {
    const [data, setData] = useState();

    useEffect(() => {
        if (app) {
            getObjectData(app, objectId)
                .then((response) => {
                    setData(response[0])
                    // console.log(`Qlik Sense object ${objectId} rendered successfully.`);
                })
                .catch(() => {
                    console.error('Error rendering Qlik Sense object:', error);
                });
        } else {
            console.error('Qlik Sense app is not loaded yet');
        }
    }, [app, objectId]);
    return (
        <>
            {data && (<div className="card">
                <h3 className="mb-1">{title}</h3>
                <div className="d-flex justify-content-between">
                    <div className="big-kpi">{data[0].qText}</div>
                    <div className="d-flex align-items-center gap-1">
                        <TargetIco />
                        {data[3].qText}
                    </div>
                </div>
                <div className="progressbar my-2">
                    <div className="progressbar-inner" 
                        style={{
                        width: data[0].qText.includes('%') 
                            ? `${parseFloat(data[0].qText.replace('%', ''))}%`  // Eğer yüzde ise, olduğu gibi kullan
                            : `${(parseFloat(data[0].qText) / parseFloat(data[3].qText)) * 100}%`  // Eğer düz sayı ise, oranla hesapla
                        }}>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column">
                        <div className="light-text">Last Month</div>
                        <div className="kpi-text">{data[1].qText}</div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                        <div className="light-text">Last Year</div>
                        <div className="kpi-text">{data[2].qText}</div>
                    </div>
                </div>
            </div>)}
        </>
    );
}
