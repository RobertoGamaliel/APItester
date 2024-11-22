import React, { useState, useEffect } from 'react';

const NewSchemma = (p) => {
    const index = p.index ?? -1;
    const newSchemma = p.newSchemma ?? true;
    const schemmas = p.schemmas ?? [];
    const setschemmas = p.setschemmas ?? null;
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const formStyle = "form-control form-control-sm round-m shadow-sm border border-3";
    const containerStyle = p.containerStyle ?? "bw-1300 shadow-multi round-m p-1 pb-3 mt-3 pt-2";
    const [schemma, setschemma] = useState({
        url: "",
        method: "GET",
        headers: `{}`,
        body: `{}`,
        bodyError: false,
        headersError: false,
        test: null
    });

    useEffect(() => {
        setschemma({
            url: p.schemma?.url ?? "",
            method: p.schemma?.method ?? "GET",
            headers: p.schemma?.headers ? JSON.stringify(p.schemma?.headers) : `{}`,
            body: p.schemma?.body ? JSON.stringify(p.schemma?.body) : `{}`,
            bodyError: false,
            headersError: false,
            test: p.schemma?.test
        });
    }, [p.schemma]);

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

        if (schemmaToSave.bodyError || schemmaToSave.headersError) {
            setschemma(schemmaToSave);
            return;
        }

        let actualSchemmas = JSON.parse(JSON.stringify(schemmas));
        actualSchemmas[index] = {
            url: schemmaToSave.url,
            method: schemmaToSave.method,
            headers: JSON.parse(schemmaToSave.headers),
            body: JSON.parse(schemmaToSave.body),
            test: schemmaToSave.test
        };

        setschemmas(actualSchemmas);

    }

    const addSchemma = () => {
        let actualSchemmas = [...schemmas];
        actualSchemmas.push({
            url: schemma.url,
            method: schemma.method,
            headers: JSON.parse(schemma.headers),
            body: JSON.parse(schemma.body),
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

        let updatedSchemmas = [...schemmas];
        let schemaIndex = updatedSchemmas[index];
        let schemaNewIndex = updatedSchemmas[newIndex];
        updatedSchemmas[index] = schemaNewIndex;
        updatedSchemmas[newIndex] = schemaIndex;
        setschemmas(updatedSchemmas);
    }

    const deleteSchemma = () => {
        let actualSchemmas = [...schemmas];
        actualSchemmas.splice(index, 1);
        setschemmas(actualSchemmas);
    }

    return (
        <div className={containerStyle}>
            {!newSchemma && <div className='w-100 text-center text-bold'>Solicitud {index + 1}</div>}
            <div className='row justify-content-center w-100 m-0 p-0'>
                <div className='form-group bw-800'>
                    <label className='text-bold w-100 text-start ps-2'>URL</label>
                    <input type='text' className={formStyle} value={schemma.url} name='url' onChange={changeSchemma} />
                </div>

                <div className='bw-300'>
                    <label className='text-bold w-100 text-start ps-2'>Método</label>
                    <select className={formStyle} value={schemma.method} name='method' onChange={changeSchemma}>
                        {methods.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className='w-100 mt-2 border-bottom' />
                <div className='bw-700'>
                    <label className='text-bold w-100 text-start ps-2'>
                        Body{schemma.bodyError ? <span className='text-danger text-s ms-2'> (Error en la estructura del JSON)</span> : null}
                    </label>
                    <textarea rows={newSchemma ? 5 : 1} className={formStyle} value={schemma.body} name='body' onChange={changeSchemma} > </textarea>
                </div>
                <div className='bw-400'>
                    <label className='text-bold w-100 text-start ps-2'>
                        Headers{schemma.headersError ? <span className='text-danger text-s ms-2'> (Error en la estructura del JSON)</span> : null}
                    </label>
                    <textarea rows={newSchemma ? 5 : 1} className={formStyle} value={schemma.headers} name='headers' onChange={changeSchemma} > </textarea>
                </div>
                <div className='w-100 mt-3'></div>
                {newSchemma && <button className='btn btn-warning btn-sm text-bold shadow bw-300 round-m'
                    disabled={disableAddButton()} onClick={addSchemma}
                >Agregar</button>}

                {!newSchemma &&
                    <div className='row justify-content-evenly w-100 m-0 p-0'>
                        <button className='btn btn-light btn-sm border border-danger round-m shadow bw-200'
                            onClick={deleteSchemma}
                        >Eliminar</button>
                        <button
                            className='btn btn-light btn-sm border border-2 round-m shadow bw-100 text-bold'
                            onClick={() => changeIndex(true)}
                            disabled={index === 0}
                        >Subir</button>
                        <button
                            className='btn btn-light btn-sm border border-2 round-m shadow bw-100 text-bold'
                            disabled={index === schemmas.length - 1}
                            onClick={() => changeIndex(false)}
                        >Bajar</button>
                    </div>

                }
                {schemma.test && <div className='w-100 mt-3 border-top'>
                    <div className={`text-bold text-center p-0 ${schemma.test.error ? 'text-danger' : 'text-success'}`}
                    >
                        {schemma.test.error ? "Error" : "Prueba exitosa"} <span className='text-s text-400 ms-2'>{schemma.test.time}</span>
                        <div className='w-100' />
                        <span className='text-s text-400 mt-0'>{schemma.test.data ?? "Sin datos de respuesta"}</span>

                    </div>

                </div>}
            </div>
        </div >
    )
}

export default NewSchemma;