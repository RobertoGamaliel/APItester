import React, { useState, useEffect } from 'react';
import JsonEditor from './Components/JsonEditor';

const NewSchemma = (p) => {
    const index = p.index ?? -1;
    const isActiveTest = p.isActiveTest ?? false;
    const newSchemma = p.newSchemma ?? true;
    const schemmas = p.schemmas ?? [];
    const setschemmas = p.setschemmas ?? null;
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const formStyle = "form-control form-control-sm shadow-sm border round-s";
    const containerStyle = newSchemma ?
        "bw-1300 shadow-multi round-m p-1 pb-3 mt-3 pt-2 bg-white" :
        `bw-1300 shadow-sm round-m p-1 pt-4 mt-4 border bg-light ${isActiveTest ? 'border-warning border-4 scale-continue-025' : ''}`;
    const [schemma, setschemma] = useState({
        url: p.schemma?.url ?? "",
        method: p.schemma?.method ?? "GET",
        headers: p.schemma?.headers ?? {},
        body: p.schemma?.body ?? {},
        bodyError: false,
        headersError: false,
        test: p.schemma?.test
    });


    useEffect(() => {
        setschemma({
            url: p.schemma?.url ?? "",
            method: p.schemma?.method ?? "GET",
            headers: p.schemma?.headers ?? {},
            body: p.schemma?.body ?? {},
            bodyError: false,
            headersError: false,
            test: p.schemma?.test
        });
    }, [p.schemma, p.schemma?.url, p.schemma?.method, p.schemma?.headers, p.schemma?.body, p.schemma?.test]);

    const changeSchemma = (e) => {
        let { name, value } = e.target;
        if (['body', 'headers'].includes(name)) {
            let obj = tryParseObject(value);
            value = value.trim();
            if (obj === null) {
                saveLocalOrGlobal({ ...schemma, [name]: value, [name + 'Error']: true });
                return;
            }
            saveLocalOrGlobal({ ...schemma, [name]: value, [name + 'Error']: false });
            return;
        }
        saveLocalOrGlobal({ ...schemma, [name]: value });
    }

    const saveLocalOrGlobal = (schemmaToSave) => {

        if (newSchemma) {
            setschemma(schemmaToSave);
            return;
        }

        let actualSchemmas = JSON.parse(JSON.stringify(schemmas));
        actualSchemmas[index] = {
            url: schemmaToSave.url,
            method: schemmaToSave.method,
            headers: schemmaToSave.headers,
            body: schemmaToSave.body,
            test: schemmaToSave.test
        };

        setschemmas(actualSchemmas);

    }

    const addSchemma = () => {
        let actualSchemmas = [...schemmas];
        actualSchemmas.push({
            url: schemma.url,
            method: schemma.method,
            headers: schemma.headers,
            body: schemma.body,
            test: schemma.test
        });
        setschemmas(actualSchemmas);
        setschemma({
            url: '',
            method: 'GET',
            headers: '{}',
            body: '{}',
            bodyError: false,
            headersError: false,
            test: null
        });
    }

    const tryParseObject = (value) => {
        try {
            let obj = JSON.parse(value);
            return obj;
        } catch (error) {
            return null;
        }
    }

    const disableAddButton = () => {
        if (schemma.bodyError || schemma.headersError) return true;
        if (schemma.url.trim() === '') return true;
        return false;
    }

    const changeIndex = (up) => {
        if (up && index === 0) return;
        if (!up && index === schemmas.length - 1) return;

        let newIndex = index;
        if (up) newIndex = index - 1;
        else newIndex = index + 1;

        let updatedSchemmas = JSON.parse(JSON.stringify(schemmas));
        let schemaIndex = JSON.parse(JSON.stringify(schemmas[index]));
        let schemaNewIndex = JSON.parse(JSON.stringify(schemmas[newIndex]));
        console.log(`schemaIndex`, schemaIndex, schemaNewIndex);
        updatedSchemmas[index] = schemaNewIndex;
        updatedSchemmas[newIndex] = schemaIndex;
        setschemmas(updatedSchemmas);
    }

    const deleteSchemma = () => {
        let actualSchemmas = [...schemmas];
        actualSchemmas.splice(index, 1);
        setschemmas(actualSchemmas);
    }

    /**
     * Recibe Un JSON desde el editor, el json es válido. De acuerdo a si se visualiza en modo
     * edición o no, se guarda en el estado local o en el estado global
     * @param {Object} jsonData el objeto json que se recibe desde el editor
     * @param {String} type el tipo de json que se recibe, puede ser 'body' o 'headers'
     */
    const saveSchemmaFromEditor = (jsonData, type) => {
        if (newSchemma) {
            setschemma({ ...schemma, [type]: jsonData });
            return;
        }
        let actualSchemmas = [...schemmas];
        actualSchemmas[index][type] = jsonData;
        setschemmas(actualSchemmas);
    }

    return (
        <div className={containerStyle + (schemma?.test?.error ? " border-danger border-3" : "")} style={{ position: "relative" }}
            id={[undefined, null].includes(index) ? "sinid" : `${index}Schemma`}>
            {!newSchemma && <div className='col-auto text-center text-bold ps-3' style={{ position: "absolute", top: 0 }}>Solicitud {index + 1}</div>}
            <div className='row justify-content-evenly w-100 m-0 p-0'>

                <div className='form-group bw-650 p-0 m-0'>
                    {newSchemma && <label className='text-bold w-100 text-start ps-2'>URL</label>}
                    <input type='text' className={formStyle} value={schemma.url} name='url' onChange={changeSchemma} />
                </div>

                <div className='bw-600 p-0 m-0'>
                    {newSchemma && <label className='text-bold w-100 text-start ps-2'>Método</label>}
                    <select className={formStyle} value={schemma.method} name='method' onChange={changeSchemma}>
                        {methods.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className='w-90' />
                <div className='bw-650 p-0 m-0'>

                    <JsonEditor json={schemma.body}
                        pharams={{ title: 'Body' }}
                        viewMode={newSchemma ? false : true}
                        save={(jsonData) => saveSchemmaFromEditor(jsonData, 'body')}
                    />

                </div>
                <div className='bw-600 p-0 m-0'>
                    <JsonEditor jsonString={schemma.headers}
                        pharams={{ title: 'Headers' }}
                        styles={{ container: 'w-100 m-0 p-1' }}
                        viewMode={newSchemma ? false : true}
                        save={(jsonData) => saveSchemmaFromEditor(jsonData, 'headers')}
                    />
                </div>
                <div className='w-100 m-0 p-0'></div>
                {newSchemma && <button className='btn btn-warning btn-sm text-bold shadow bw-300 round-xl'
                    disabled={disableAddButton()} onClick={addSchemma}
                >Agregar</button>}

                {!newSchemma &&
                    <div className='row justify-content-end w-100 m-0 p-0'>
                        <div className='border bg-red3 text-white p-0 contenedor round-xl shadow-sm scale-025 pointer bw-150 text-bold me-2 ms-2 mt-1 mb-1'
                            onClick={deleteSchemma}
                        >Eliminar</div>
                        <div
                            className='border p-0 contenedor round-xl shadow-sm scale-025 pointer bw-100 text-bold me-2 ms-2 mt-1 mb-1'
                            onClick={() => changeIndex(true)}
                            disabled={index === 0}
                        >Subir &#9650;</div>
                        <div
                            className='border p-0 contenedor round-xl shadow-sm scale-025 pointer bw-100 text-bold me-2 ms-2 mt-1 mb-1'
                            disabled={index === schemmas.length - 1}
                            onClick={() => changeIndex(false)}
                        >Bajar &#9660;</div>
                    </div>

                }
                {schemma.test && <div className='w-100 mt-3 border-top'>
                    <div className={`text-bold text-center p-0 ${schemma?.test?.error ? 'text-danger' : 'text-success'}`}
                    >
                        {schemma?.test?.error ? "Error" : "Prueba exitosa"} <span className='text-s text-400 ms-2'>{schemma?.test?.time}</span>
                        <div className='w-100' />
                        <span className='text-m text-400 mt-0'>{schemma?.test?.data ?? "Sin datos de respuesta"}</span>

                    </div>

                </div>}
            </div>
        </div >
    )
}

export default NewSchemma;