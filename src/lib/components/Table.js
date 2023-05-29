import '../style/Table.css'
import Row from './Row'
import React from "react"
import { useEffect, useState } from 'react'
import arrowDown from '../assets/arrow_down_2.png'
import dayjs from 'dayjs'

export default function Table({data}) {

    const [listElements, setListElements] = useState(data)
    const [pages, setPages] = useState([])
    const [disclaimer, setDisclaimer] = useState(false)
    const [displayingOption, setDisplayingOption] = useState(2)
    const [selectedPage, setSelectedPage] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState({column: 'initialize', type: 'initialize'})

    useEffect(() => {
        setPages(dispatchElementByPages(listElements, displayingOption))
      
       
    }, [listElements, displayingOption])
    

    ///utils method

    const checkForDate = () => {
        var customParseFormat = require('dayjs/plugin/customParseFormat')
        dayjs.extend(customParseFormat)
        const myArray = []

        listElements.forEach((obj) => {
            const newObj = {...obj}
            myArray.push(newObj)
        })
       

        myArray.forEach((obj) => {
            for(let [key, value] of Object.entries(obj)) {
                
                if ( value && dayjs(value, 'YYYY-MM-DD').isValid()) {
                    let date = new Date(value)
                    obj[key] = date
                } 
            }
        })
        return myArray
      
    }

    const parseDate = (arr) => {
        arr.forEach((obj) => {
            for(let [key, value] of Object.entries(obj)) {
                if ( value && value instanceof Date) {
                    let date = value.toJSON()
                    obj[key] = date
                } 
            }
        })
    }


    const columnFilter = (e) => {
        const columnName = e.currentTarget.dataset.column
        const data = checkForDate()
        
        
        let sortedRow = []
        
        if(selectedFilter.column === columnName && selectedFilter.type === "up") {
            sortedRow = data
            setSelectedFilter({column: 'no', type: 'no'})
        }
        else if(selectedFilter.column === columnName) {
            sortedRow = data.sort(columnSorter(columnName))
            sortedRow = sortedRow.reverse()
            setSelectedFilter({column: columnName, type: 'up'})
        } else {
            sortedRow = data.sort(columnSorter(columnName))
            setSelectedFilter({column: columnName, type: 'down'})
        }
        parseDate(sortedRow)
        setListElements(sortedRow)
    }

    const columnSorter = (columnName) => {
        return function(a, b) {
            if (a[columnName] < b[columnName]) {
                return -1
            }

            if (a[columnName] > b[columnName]) {
                return 1
            }
            return 0
        }
    }


    const formatColumnTitle = (string) => {
        const formatedString = string.charAt(0).toUpperCase() + string.slice(1)
        return formatedString
    }

    const createSpaceBetweenWords = (string) => {
        const formatedString = string.replace(/[A-Z]/g, s => ' ' + s.toUpperCase()).trim()
        return formatedString
    }

    const removeDuplicates = (arr) => {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    const dispatchElementByPages = (array, chunkCount) => {
        const chunks = []
        const formatedChunks = []
        const test = [...array]

        while(test.length) {
            chunks.push(test.splice(0, chunkCount))
        }

        chunks.forEach((chunk) => {
            let rows = []

            chunk.forEach((el) => {
                const values = Object.values(el)
                rows.push(values)
            })
            formatedChunks.push(rows)
        })
       
        return formatedChunks
    }

    /////


    /// Create columns method

    const columns = []

    listElements.forEach((element) => {
        const columnNames = Object.keys(element)
        columnNames.forEach((column) => {
            columns.push(column)
        })
    })
    
    const columnIds = removeDuplicates(columns)
    let formatedColumns = removeDuplicates(columns)
    formatedColumns = formatedColumns.map( el => formatColumnTitle(el))
    formatedColumns = formatedColumns.map( el => createSpaceBetweenWords(el))

    ////////

    ///////// Search method

    const launchSearch = (event, elements = listElements) => {
        const input = event.currentTarget.value.toUpperCase().trim()
        const disclaimer = document.querySelector('.disclaimer')
        
        if(input.length >= 3) {
          
            let results = []
            const inputs = input.split(" ")
            

            elements.forEach((row) => {
                let dataLine = Object.values(row)
                
                dataLine.every((element) => {
                    inputs.every((word) => {
                        if( element !== undefined && element.toUpperCase().includes(word)) {
                            results.push(row)
                            return false
                        }
                        return true
                    })
                    return true
               })
            })
            results = removeDuplicates(results)
            setListElements(results)

            if (results.length === 0 && !disclaimer)  {
                setDisclaimer(true)
            }
        } else if (input.length === 0) {
            setListElements(data)
            setDisclaimer(false)
        }
    }

    /////////////

    ////Displaying option method

    const initializeElementsPerPage = (value) => {
        setDisplayingOption(value)
        setSelectedPage(0)
    }


    return (
        <div className="main-container-table">
            <div className='displaying-options'>
                <label for="displaying-options">Elements par page</label>
                <select name="nb-entries" id="displaying-options" onChange={(e) => initializeElementsPerPage(e.currentTarget.value)}>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="10">10</option>
                </select>
            </div>
            <div className='search-bar-container'>
                    <label for="query" id="query"></label>
                    <input type="search" name="query" placeholder='Entrez votre recherche' onKeyUp={(e) => launchSearch(e)}></input>
            </div>
            <div className='container-table'>
                {
                    disclaimer ? <h2 class='disclaimer'>Désolé, il n'y a aucun résultat pour votre recherche</h2> :
                    null
                }
                <div className="header-table">
                    { formatedColumns && formatedColumns.map((el, index) => (
                        <div className="column" data-column={columnIds[index]} onClick={(e) => columnFilter(e)}>
                            <div>{el}</div>
                                { columnIds[index] === selectedFilter.column ? <img src={arrowDown} alt="arrow" className={selectedFilter.type === "up" ? "arrow-up" : "arrow-down"} /> : null}
                            </div>
                    ))}
                </div>
                <div className='container-table'>
                { pages[selectedPage] && pages.length > 0 ? pages[selectedPage].map((row) => (
                        <div className='row'>
                            <Row data={row} />
                        </div>
                )) : null}
                </div>
            </div>
            <div className='pagination'>
                    {pages.length > 0 && pages.map((page, index) => (
                        <div className="item" onClick={ () => setSelectedPage(index)}>{index + 1}</div>
                    ))}
            </div>
        </div>
    )
}