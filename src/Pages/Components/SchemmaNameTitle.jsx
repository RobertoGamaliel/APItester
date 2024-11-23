import React, { useState, useEffect } from 'react';

/**
 * Sis e envia el titulo, se muestra, si no se envia pero se envia el indice se mostrará el numero de solicitud, en el ultimo cas se muestra el titulo por defecto
 * @param {string} title title to show
 * @param {number} index index of the schemma
 * @param {boolean} newSchemma if the schemma is new then don't show the title
 * @param {function} changeTitleFunction function to change the title
 * @returns {JSX.Element} 
 */
const SchemmaNameTitle = (p) => {
    const title = p.title ? p.title : (p.index !== undefined ? `Solicitud ${p.index + 1}` : 'Soliciutd no numerada y sin nombre');
    const changeTitleFunction = p.changeTitleFunction ?? (() => { });

    const [showMode, setshowMode] = useState('view');
    const changeTitleVal = (e) => {
        let value = e.target.value;
        changeTitleFunction(value);
    }

    if (p.newSchemma || showMode != 'view') return (
        <div className='row justify-content-start w-100 m-0 p-0' style={{ position: "absolute", top: 0 }}>
            <input
                type='text'
                className='form-control form-control-sm border round-s shadow-sm bw-250 mb-2 mt-0 '
                onChange={changeTitleVal}
                value={p.title ?? ""}
                placeholder='Agrege titulo a esta consulta' />
            {!p.newSchemma && <div className='border p-0 contenedor round-xl shadow-sm scale-025 pointer bw-100 text-bold text-s me-2 ms-2 mb-2'
                onClick={() => setshowMode('view')}
            >Listo</div>}
        </div>);
    return (
        <div className='col-auto text-center text-bold ps-3 pointer scale-025'
            style={{ position: "absolute", top: 0 }}
            onClick={() => setshowMode('edit')}
        >{title}</div>
    )
}

export default SchemmaNameTitle;