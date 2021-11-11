import React, { useEffect, useState } from 'react';
import "./Folder.css"
import axios from 'axios';
import Cookies from "js-cookie";

function FolderItem(props) {
    const folderId = props.match.params.id

    const token = Cookies.get('KB-Token')

    const [folder, setFolder] = useState({})

    useEffect(async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setFolder(res.data.data)
                }
            }
        }
    }, [])

    useEffect(async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setFolder(res.data.data)
                }
            }
        }
    }, [folderId])

    const showWordsInFolder = () => {
        if (folder.list_vocabularies) {
            return folder.list_vocabularies.map(item => {
                console.log(item)
                return (
                    <div className="word-item">
                        <div className="word-item-vocabulary">
                            {item.vocabulary}
                        </div>

                        <div className="word-item-mean">
                            <div className="word-item-meaning">
                                {showMeaning(item)}
                            </div>

                            <div className="word-item-reading">
                                {showReading(item)}
                            </div>
                        </div>

                        <div className="word-item-action">
                            <i className="fas fa-eye"></i>
                        </div>
                    </div>
                )
            })
        }
    }

    const showMeaning = (item) => {
        let result = ""

        let meaningList = item.definitions.english_definitions

        if (meaningList.length > 4) {
            meaningList = meaningList.slice(0, 4)
        }

        for (const mean in meaningList) {
            result = result + `${meaningList[mean]}` + ", "
        }

        result = result.slice(0, -2)

        return result
    }

    const showReading = (item) => {
        let result = ""

        const readingList = item.reading.reading

        for (const reading in readingList) {
            result = result + `${readingList[reading]}` + ", "
        }

        result = result.slice(0, -2)

        return result
    }

    return (
        <div className="folder-detail">
            {showWordsInFolder()}
        </div>
    );
}

export default FolderItem;