// Farklı ortamları bir nesnede birleştirin
const environments = {
  dev: {
    config: {
      host: 'qlikprod',
      prefix: '/',
      port: 443,
      isSecure: true,
    },
  },
  test: {
    config: {
      host: 'qlikprod',
      prefix: '/',
      port: 443,
      isSecure: true,
    },
  },
  prod: {
    config: {
      host: window.location.hostname,
      prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/extensions') + 1),
      port: window.location.port,
      isSecure: window.location.protocol === 'https:',
    },
  },
};

// Çalışma zamanındaki ortama bağlı olarak "env" seçimi
const { config } = environments[import.meta.env.MODE];

// Qlik Sense API erişimi için "require.js" eklenir
window.require.config({
  baseUrl: `${(config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? `:${config.port}` : '') + config.prefix
    }resources`,
});

/**
 * Genel Qlik Objesi (Root API)
 *
 * @see {@link https://help.qlik.com/en-US/sense-developer/February2024/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-interface-interface.htm}
 */
const qlikAPI = new Promise((resolve, reject) => {
  try {
    window.require(['js/qlik'], (qlik) => {
      resolve(qlik);
    });
  } catch (error) {
    reject(error);
  }
});

/**
 * Döndürülen/Belirtilen uygulamayı açar (App API)
 *
 * @param {String} appId
 * @returns {QlikApp} Qlik App
 *
 * @see {@link https://help.qlik.com/en-US/sense-developer/February2024/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-app-interface.htm}
 */
export function openApp(appId) {
  return new Promise((resolve, reject) => {
    qlikAPI.then((qlik) => resolve(qlik.openApp(appId, config))).catch((error) => reject(error));
  });
}

/**
 * Döndürülen/Belirtilen nesnenin modelini alır
 *
 * @param {QlikApp} app Qlik App
 * @param {String} objectId Object ID
 * @returns {QlikObject} Qlik Object Layout
 *
 * @see {@link https://help.qlik.com/en-US/sense-developer/February2024/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/AppAPI/getObject-method.htm}
 */
export function getObjectModel(app, objectId) {
  return new Promise((resolve) => {
    app.getObject(objectId).then((_model) => {
      resolve(_model);
    });
  });
}

/**
 * Döndürülen/Belirtilen nesnenin verilerini alır
 *
 * @param {QlikApp} app Qlik App
 * @param {String} objectId Object ID
 * @returns {Hypercube} Objenin hypercube verisi (qMatrix)
 *
 * @see {@link https://help.qlik.com/en-US/sense-developer/February2024/Subsystems/EngineJSONAPI/Content/service-genericobject-gethypercubedata.htm}
 */
export function getObjectData(app, objectId) {
  return new Promise((resolve) => {
    getObjectModel(app, objectId).then((_model) => {
      // const qWidth = _model.layout.qHyperCube.qSize.qcx + _model.layout.qHyperCube.qNoOfLeftDims;
      // const qHeight = Math.floor(10000 / _model.layout.qHyperCube.qSize.qcx + _model.layout.qHyperCube.qNoOfLeftDims);
      const qWidth = _model.layout.qHyperCube.qSize.qcx;
      const qHeight = Math.floor(10000 / _model.layout.qHyperCube.qSize.qcx);
      _model
        .getHyperCubeData('/qHyperCubeDef', [
          {
            qTop: 0,
            qLeft: 0,
            qWidth,
            qHeight,
          },
        ])
        .then((_data) => {
          resolve(_data[0].qMatrix);
        });
    });
  });
}

export default qlikAPI;
