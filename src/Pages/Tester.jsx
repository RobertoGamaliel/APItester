import React, { useState, useEffect } from 'react';
import NewSchemma from './NewSchemma';
import FetchAPI from '../Tools/FetchAPI';

const Tester = () => {
    const [schemmas, setschemmas] = useState([]);
    const [testing, settesting] = useState({ active: false, index: -1 });
    const [textSchemmas, settextSchemmas] = useState("[]");
    const [errorEchemmas, seterrorEchemmas] = useState(false);
    const ajusteEsquemaDesdeInput = (e) => {
        let { value } = e.target;
        settextSchemmas(value);
        try {
            let obj = JSON.parse(value);
            if (Array.isArray(obj)) {
                setschemmas(obj);
                seterrorEchemmas(false);
                return;
            }
            seterrorEchemmas(true);
        } catch (error) {
            seterrorEchemmas(true);
        }
    }

    const cambiarDesdeHijo = (schemmas) => {
        setschemmas(schemmas);
        settextSchemmas(JSON.stringify(schemmas));
        seterrorEchemmas(false);
    }

    const testApis = async () => {
        if (!schemmas.length) return;
        let copyTesting = { active: true, index: 0 };

        for (let i = 0; i < schemmas.length; i++) {
            copyTesting = { active: true, index: i };
            settesting(copyTesting);
            let s = JSON.parse(JSON.stringify(schemmas[i]));
            let startTime = new Date().getTime();
            let testResults = await FetchAPI(s.url, s.body, s.headers, s.method);
            let endTime = new Date().getTime();
            s.test = { ...testResults, time: (endTime - startTime) + "ms" };
            let schemmasCopy = [...schemmas];
            schemmasCopy[i] = s;
            setschemmas(schemmasCopy);
        }
        settesting({ active: false, index: -1 });

    }

    return (
        <div className='vw-100 vh-100 m-0 p-1 pt-2 pb-5 overflow'>
            <div className='row justify-content-evenly w-100 m-0 p-0'>
                <div className='form-group'>
                    <label className='text-bold'>Esquemas en texto</label>
                    <textarea type='text' className='form-control form-control-sm border' value={textSchemmas} rows={1} onChange={ajusteEsquemaDesdeInput} ></textarea>
                </div>
                {<div className={'col-auto' + (testing.active ? ' opacity-50' : '')}>
                    <NewSchemma schemmas={schemmas} setschemmas={cambiarDesdeHijo} newSchemma={true} />
                </div>}
                <button className='btn text-bold border border-dark round-xxl shadow bw-800 mt-3 mb-3 btn-warning'
                    disabled={testing.active || schemmas.length === 0}
                    onClick={() => {
                        if (testing.active) {
                            settesting({ active: false, index: -1 });
                        } else {
                            testApis();
                        }
                    }}>IniciarTest</button>
                {schemmas.map((s, i) =>
                    <React.Fragment key={i}>
                        <NewSchemma
                            schemmas={schemmas}
                            setschemmas={cambiarDesdeHijo}
                            schemma={s}
                            newSchemma={false}
                            containerStyle={`bw-1200 shadow-sm round-m p-1 mt-4 border border-2 border-2 bg-light 
                                            ${testing.active && testing.index === i ? 'border-warning scale-contnue-05' : ''}`}
                            index={i}
                        />
                        <div className='w-100'></div>
                    </React.Fragment>
                )}

            </div>
        </div>
    )
}

export default Tester;