import '../style/Table.css'
import dayjs from 'dayjs'
import React from 'react'

export default function Row({data}) {

    const getModififiedStringDate = (el) => {
        var customParseFormat = require('dayjs/plugin/customParseFormat')
        dayjs.extend(customParseFormat)

        const getTvalue = (value) => value === "T"

        if ( dayjs(el, 'YYYY-MM-DD').isValid()) {
            el = el.split("")
            let index = el.findIndex(getTvalue)
            el = el.slice(0, index).join("")
          
        }
        
        return el
    }

    return(
        data.map((el, index) => (
            <p className="row-element" key={(index)}>{getModififiedStringDate(el)}</p>
        ))
    )
}