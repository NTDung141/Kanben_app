import React, { useEffect, useState } from 'react';
import "./Folder.css"
import axios from 'axios';
import Cookies from "js-cookie";

function FolderItem(props) {
    const folderId = props.match.params.id

    const token = Cookies.get('KB-Token')

    const [folder, setFolder] = useState({})

    useEffect(async () => {
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, null, {
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
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, null, {
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
                return (
                    <h5>{item.vocabulary}</h5>
                )
            })
        }
    }

    return (
        <div>
            <h3>FolderDetail Page</h3>

            <h5>
                Vocabulary list
            </h5>

            <div>
                {showWordsInFolder()}
            </div>
        </div>
    );
}

export default FolderItem;