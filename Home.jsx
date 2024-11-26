import {
  DataGovIco,
  DevelopmentAutoIco,
  DevSecOpsIco,
  InfoMetricsIco,
  PipelineHealthIco,
  UsageCapacityIco,
} from '@/assets/svg';

import '../assets/css/home.css';
import {Card , Loader ,QlikObject } from '@/components';
import { useEffect, useState } from 'react';
import { openApp } from '@/util/qlikConnection';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setSheedId } from '@/app/features/data';

export default function Home() {
  const [app, setApp] = useState();
  const [isLoading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tab1");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sections = [
    {
      class: "data-governance",
      title: "Data Governance",
      icon: <DataGovIco />,
      cards: [
        { objectId: "WPEZKJ", title: 'DQ Score' },
        { objectId: "JTmuuHB", title: 'Veri Envanteri Skor' }
      ],
      id:"4a48a9fb-a902-4219-8bac-bf8dc355cf48"
    },
    {
      class: "usage-capacity",
      title: "Usage & Capacity",
      icon: <UsageCapacityIco />,
      cards: [
        { objectId: "cfgMWb", title: 'Prisma Kullanım Oranı' },
        { objectId: "xphYcfe", title: 'ODI Prisma Dönüşüm' },
        { objectId: "KgaCXB", title: 'Qlik Rapor Kalite Skoru' }
      ],
      id:"f7223bad-7771-4427-bd0b-cd29844a53e8"
    },
    {
      class: "pipeline-health",
      title: "Pipeline Health",
      icon: <PipelineHealthIco />,
      cards: [
        { objectId: "XmpfWmm", title: 'Hassas Path SLA Uyum' },
        { objectId: "xPzmuP", title: 'Kritik İş Kesici DQ Sayıları' },
        { objectId: "xPzmuP", title: 'Historical STG Tablo' },
        { objectId: "MPvgh", title: 'Metadata Farklılıkları' }
      ],
      id:"9a7c8ce2-5aa8-474d-8ab4-68d386141344"
    },
    {
      class: "development-automation",
      title: "Development & Automation",
      icon: <DevelopmentAutoIco />,
      cards: [
        { objectId: "hgPXnh", title: 'ODI Code Quality' },
        { objectId: "JFAfPpu", title: 'Procedure Sayıları' }
      ],
      id:"d68e016b-488a-4b35-bf07-7cdcdee1aa40"
    },
    {
      class: "devsecops",
      title: "DevSecOps",
      icon: <DevSecOpsIco />,
      cards: [
        { objectId: "tgkHEmp", title: 'DevSeOps' }
      ],
      id:"b16f5af9-a9e9-4c73-a7dc-b4b4aadb1876"
    }
  ];

  // Veriyi card sayısına göre sıralıyoruz
  const sortedSections = sections.sort((a, b) => b.cards.length - a.cards.length);

  console.log(sortedSections)
  useEffect(() => {
   
    if (!app) {
      openApp(import.meta.env.VITE_APP_APP1)
        .then((_app) => {
          _app.clearAll(true).then(() => {
            setApp(_app);
            setTimeout(() => {
              setLoading(false);  
            }, 750);
          });
         
        })
        .catch((error) => {
          //setError(true);
          console.error('Uygulama başlatma hatası:', error);
        });
    }
  }, [app]);

  function applyFilter(name, tabInfo){
    setLoading(true);
    setActiveTab(tabInfo);
      app.field("UnitName").selectValues([name]).then((data) =>{
        console.log("value selected successfully",data);
        setTimeout(() => {      
          setLoading(false);
        }, 250);
    });
   }

   function handleColumnClick(sheetId){
    dispatch(setSheedId(sheetId));
    setTimeout(() => {
      navigate("/details");
    }, 250);
   }

  return (
    <>
        {isLoading ? (
        <div className="fixed-loader">
          <Loader />
        </div>
      ) : (
        <>
        <div className="nav-tab-wrapper">
        <div className={activeTab === "Tab1" ? "tab-item active" : "tab-item"}  onClick={() => applyFilter("ALL", "Tab1")}>Tüm Birimler</div>
        <div className={activeTab === "Tab2" ? "tab-item active" : "tab-item"}  onClick={() => applyFilter("AI FACTORY", "Tab2")}>AI Factory</div>
        <div className={activeTab === "Tab3" ? "tab-item active" : "tab-item"}  onClick={() => applyFilter("KURUMSAL VERİ VE RİSK YÖNETİM ÇÖZÜMLERİ", "Tab3")}>Kurumsal Veri ve Risk</div>
        <div className={activeTab === "Tab4" ? "tab-item active" : "tab-item"}  onClick={() => applyFilter("VERİ AMBARI MIS VE İŞ ZEKASI ÇÖZÜMLERİ", "Tab4")}>Veri Ambarı MIS & İş Zekası</div>
        <div className={activeTab === "Tab5" ? "tab-item active" : "tab-item"}  onClick={() => applyFilter("VERİ YÖNETİŞİMİ FİNANSAL ŞİRKETLER VERİ AMBARI VE RAPORLAMA", "Tab5")}>Veri Yönetişimi</div>
      </div>

      <div className="card top-data-grid">
        <div className="d-flex flex-column dataops-skor">
          <h3 className="top-data-col-title">DataOps Skor</h3>
          <QlikObject objectId='qkySjP' app={app} elementId={`qlik-object-dataopsSkor`} />
{/* 
          <div style={{ width: '10rem', backgroundColor: '#ddd' }}>
            
          </div> */}
        </div>
        <div className="birim-bazli-skor">
          {/* <h3 className="top-data-col-title">Birim Bazlı Skor</h3> */}

          <div className="d-flex flex-column gap-4">
          <QlikObject objectId='Pwrm' app={app} elementId={`qlik-object-birimBazliSkor`} />

          </div>
        </div>
        <div className="informative-metrics">
          {/* <div className="d-flex align-items-center gap-2">
            <h3 className="top-data-col-title">Informative Metrics</h3>
            <InfoMetricsIco />
          </div> */}
          <div className="info-table-wrapper">
          <QlikObject objectId='yUUZu' app={app} elementId={`qlik-object-informativeMetrics`} />
   
          </div>
        </div>
      </div>

      <div className="data-grid mt-4">
      {sortedSections.map(section => (
        <div key={section.class} className={section.class}>
          <div className="data-col-title" onClick={() => handleColumnClick(section.id)}>
            {section.icon}
            {section.title}
          </div>
          <div className="data-col-grid">
            {section.cards.map(card => (
              <Card key={card.objectId} objectId={card.objectId} app={app} title={card.title} />
            ))}
          </div>
        </div>
      ))}
      </div>
      </>
      )}
    
    </>
  );
}
