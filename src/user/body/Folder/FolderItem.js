import React, { useEffect, useState } from 'react';
import "./Folder.css"
import axios from 'axios';
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom"
import { toast } from 'react-toastify';

function FolderItem(props) {
    const history = useHistory()

    const folderId = props.match.params.id

    const token = Cookies.get('KB-Token')

    const [folder, setFolder] = useState({})
    const [flashCardIndex, setFlashCardIndexr] = useState(0)

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

    const changeCardIndex = (index) => {
        if (index < 0 || (folder.list_vocabularies && index > folder.list_vocabularies.length - 1)) {

        }
        else {
            setFlashCardIndexr(index)
        }
    }

    const showWordInFlashCard = () => {
        if (folder.list_vocabularies) {
            return (
                <div className="flash-card-word">{folder.list_vocabularies[flashCardIndex].vocabulary}</div>
            )
        }
        else {
            return (
                <div className="flash-card-word"></div>
            )
        }
    }

    const showFlashCardAction = () => {
        if (folder.list_vocabularies) {
            return (
                <div className="flash-card-action">
                    {flashCardIndex < 1 ?
                        <i className="fas fa-long-arrow-left mr-4 cursor-pointer disable-icon"></i>
                        :
                        <i className="fas fa-long-arrow-left mr-4 cursor-pointer" onClick={() => changeCardIndex(flashCardIndex - 1)}></i>}

                    <div className="mr-4">{flashCardIndex + 1} / {folder.list_vocabularies.length}</div>

                    {flashCardIndex >= folder.list_vocabularies.length - 1 ?
                        <i className="fas fa-long-arrow-right cursor-pointer disable-icon"></i>
                        :
                        <i className="fas fa-long-arrow-right cursor-pointer" onClick={() => changeCardIndex(flashCardIndex + 1)}></i>}
                </div>
            )
        }
    }

    const goToQuiz = () => {
        if (folder.list_vocabularies.length < 4) {
            toast.error("Folder must have more than 4 words!", {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
        else {
            history.push(`/quiz/${folderId}`)
        }
    }

    return (
        <div className="folder-detail">
            <div className="flash-card">
                {showWordInFlashCard()}
            </div>

            {showFlashCardAction()}

            <div className="foler-owner">
                <div className="folder-owner-info">
                    Made by {folder.author_name ? folder.author_name : ""}
                </div>

                <div className="create-quiz-btn">
                    <button className="btn btn-primary" onClick={goToQuiz}>Create quiz</button>
                </div>
            </div>

            {showWordsInFolder()}
        </div>
    );
}

export default FolderItem;