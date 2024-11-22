import React, { useState, useEffect } from 'react';
import NewSchemma from './NewSchemma';
import FetchAPI from '../Tools/FetchAPI';

const Tester = () => {
    const [schemmas, setschemmas] = useState([]);
    const [testing, settesting] = useState({ active: false, index: -1 });
    const [textSchemmas, settextSchemmas] = useState("[]");
    const [errorEchemmas, seterrorEchemmas] = useState(false);

    const ajusteEsquemaDesdeInput = (e) => {
        let value = e.target.value;

        settextSchemmas(value);
        if (!validStringJson(value)) {
            seterrorEchemmas(true);
            return;
        }
        seterrorEchemmas(false);
        setschemmas(JSON.parse(value));
    }

    const cambiarDesdeHijo = (schemmas) => {
        setschemmas(schemmas);
        settextSchemmas(JSON.stringify(schemmas, null, 2));
        seterrorEchemmas(false);
    }

    const testApis = async () => {
        if (!schemmas.length) return;

        let schemmasCopy = JSON.parse(JSON.stringify(schemmas));

        for (let i = 0; i < schemmas.length; i++) {
            autoScroll(`${i}Schemma`);
            settesting({ active: true, index: i });
            let s = schemmasCopy[i];
            let startTime = new Date().getTime();
            let testResults = await FetchAPI(s.url, s.body, s.headers, s.method);
            let endTime = new Date().getTime();
            schemmasCopy[i].test = { ...testResults, time: (endTime - startTime) + "ms" };
            setschemmas(schemmasCopy);
        }
        setschemmas(schemmasCopy);
        settesting({ active: false, index: -1 });

    }

    /**Verifica si una variable recibida es una cadena que contiene un objeto json parseabe con JSON.parse */
    const validStringJson = (stringObj) => {
        try {
            JSON.parse(stringObj);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
    * 
    * @param {String} id search the element with the id and scroll to it whit smooth effect
    */
    const autoScroll = (id) => {
        setTimeout(() => {
            let elemento = document.getElementById(id);
            if (elemento) elemento.scrollIntoView({ behavior: "smooth" });
        }, 200);
    }

    return (
        <div className='vw-100 vh-100 m-0 p-1 pt-2 pb-5 overflow gradient-grey-light'>
            <div className='row justify-content-evenly w-100 m-0 p-0'>
                <div className='form-group'>
                    <label className='text-bold w-100 text-start'>
                        Esquemas en texto
                        <span className='text-danger w-100 ps-2 text-400 text-s'>{errorEchemmas ? "Formato no válido" : ""}</span>
                    </label>
                    <textarea
                        type='text'
                        className={'form-control form-control-sm border round-s shadow-sm' + (errorEchemmas ? ' border-danger border-3' : '')}
                        value={textSchemmas}
                        rows={1}
                        onChange={ajusteEsquemaDesdeInput}
                    ></textarea>
                </div>
                {<div className={'col-auto' + (testing.active ? ' opacity-50' : '')}>
                    <NewSchemma schemmas={schemmas} setschemmas={cambiarDesdeHijo} newSchemma={true} />
                </div>}
                <button className='btn text-bold border border-dark border-3 round-xxl shadow bw-400 mt-3 mb-3 btn-warning'
                    style={{ position: "sticky", top: 0, zIndex: 5 }}
                    disabled={testing.active || schemmas.length === 0}
                    onClick={() => {
                        if (testing.active) {
                            settesting({ active: false, index: -1 });
                        } else {
                            testApis();
                        }
                    }}>INICIAR TEST</button>
                {schemmas.map((s, i) =>
                    <React.Fragment key={i}>
                        <NewSchemma
                            schemmas={schemmas}
                            setschemmas={cambiarDesdeHijo}
                            schemma={s}
                            newSchemma={false}
                            isActiveTest={testing.active && testing.index == i}
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