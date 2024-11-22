import React, { useState, useEffect } from 'react';

const JsonEditor = (p) => {
    const [jsonData, setjsonData] = useState({});
    const [jsonString, setjsonString] = useState("");
    const [jsonError, setjsonError] = useState(false);
    const [viewMode, setviewMode] = useState(p.viewMode ?? false);
    const save = p.save ?? (() => { });
    const styles = {
        container: p.styles?.container ?? 'w-100 m-0 p-1',
        editor: p.styles?.editor ?? "w-100 bg-white text-dark form-control round-xs shadow-sm border",
        editorError: p.styles?.editorError ?? "w-100 bg-white text-dark form-control shadow-sm round-xs border border-2 border-danger",
        title: p.styles?.title ?? "w-100 text-500 text-start m-0",

    }
    const pharams = {
        title: p.pharams?.title ?? "",
    }

    useEffect(() => {
        let validJsonRecieved = validJson(p.json);
        setjsonString(validJsonRecieved ? JSON.stringify(p.json, null, 2) : "{}");
        setjsonData(validJsonRecieved ? p.json : {});
    }, [p.json]);

    /**
     * Verifica si una variable recibida es un objeto de tipo jason
     * @param {Object} obj objeto a verificar
     */
    const validJson = (obj) => {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
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
     * Ajusta el valor del editor de json, detecta si hay un error para visar al resto de funciones
     * @param {event} e 
     * @returns 
     */
    const changeValue = (e) => {
        let { value } = e.target;
        setjsonString(value);
        if (!validStringJson(value)) setjsonError(true);
        else setjsonError(false);
    }


    const saveEdition = () => {
        let newEditionState = !viewMode;
        //Si newEditionState es true, entonces el usuario eligió guardar
        if (newEditionState && jsonError) return;
        if (newEditionState) {
            //si el usuario eligió guardar, entonces parseamos el json y le damos formato al texto que se mostrará
            let obj = JSON.parse(jsonString);
            setjsonData(obj);
            setjsonString(JSON.stringify(obj, null, 2));
            //guardar en el padre
            save(obj);
        } else if (!jsonError) {
            //cuando el usuario está abriendo el editor tratamos de dar formato al json si este no tiene errores
            setjsonString(JSON.stringify(jsonData, null, 2));
        }
        setviewMode(newEditionState);

    }

    return (
        <div className={styles.container}>
            <div className='row justify-content-evenly w-100 m-0 p-0'>
                <div className={styles.title}>
                    {pharams.title}
                    <span className='text-danger w-100 ps-2 text-400 text-s'>{jsonError ? "Formato no válido" : ""}</span>
                </div>

                {!viewMode && <>
                    <textarea
                        className={jsonError ? styles.editorError : styles.editor}
                        value={jsonString}
                        onChange={changeValue}
                        rows={10}
                    ></textarea>
                    <div
                        className={`bw-200 round-xl shadow-sm mt-2 bg-light border border-3 border-warning text-s
                            ${jsonError && !viewMode ? 'opacity-50' : 'pointer scale-025 text-bold'}`
                        }
                        style={{ padding: '2px 0px' }}
                        onClick={saveEdition}
                    >GUARDAR CAMBIOS</div>
                </>}
                {viewMode && <pre
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                    className='w-100 bg-white text-dark form-control round-s border text-start pointer'
                    onClick={() => { setviewMode(false) }}>
                    {jsonString}
                </pre>
                }

            </div>
        </div>
    )
}

export default JsonEditor;