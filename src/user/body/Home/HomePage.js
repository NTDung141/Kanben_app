import React, { useEffect, useState } from 'react';
import "./HomePage.css"
import axios from 'axios'
import JishoAPI from 'unofficial-jisho-api'
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

function HomePage() {
    const jisho = new JishoAPI({ proxy: 'https://cors-anywhere.herokuapp.com/' });

    const user = useSelector(state => state.AuthReducer)

    const [result, setResult] = useState([])
    const [showedResult, setShowedResult] = useState({ slug: "" })

    const [newWord, setNewWord] = useState("")

    const [folderList, setFolderList] = useState([])

    const [newFolder, setNewFolder] = useState("")

    const token = Cookies.get('KB-Token')

    const fetchMyFolderList = async () => {
        const res = await axios.get(`http://kanben-deploy.herokuapp.com/listFolder/${user.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    setFolderList(res.data.data)
                }
            }
        }
    }

    useEffect(async () => {
        await fetchMyFolderList()
    }, [])

    const hanldeSearchNewWordChange = (e) => {
        e.preventDefault()
        const { value } = e.target
        setNewWord(value)
        if (value) {
            jishoSearch(value)
        }
    }

    const jishoSearch = (value) => {
        const promise = axios.get(`http://kanben-deploy.herokuapp.com/search/?keyWord=${value}`, null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
        if (promise) {
            promise
                .then(res => {
                    if (res) {
                        const data = res.data
                        setResult(data.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const showRecommend = () => {
        if (result.length > 0) {
            return result.map((item, index) => {
                return (
                    <a
                        className="list-group-item list-group-item-action search-bar-item"
                        onClick={() => showChoosenWord(item)}
                    >
                        {item.slug}
                    </a>
                )
            })
        }
    }

    const showChoosenWord = (item) => {
        setNewWord("")
        setShowedResult(item)
        jisho.searchForExamples(item.slug)
    }

    const showJapanesWord = () => {
        if (showedResult.japanese) {
            const japanese = showedResult.japanese
            return japanese.map(item => {
                return (
                    <div className="word-hiragana">{item.reading}</div>
                )
            })
        }
    }

    const showSenses = () => {
        if (showedResult.senses) {
            const sensesList = showedResult.senses
            return (
                <div>
                    <div className="flex-start">
                        {showPartsOfSpeech(sensesList[0].parts_of_speech)}
                    </div>

                    {showEnglishDefinition(sensesList)}
                </div>
            )
        }
    }

    const getEnglisDefinitionList = (sensesList) => {
        let result = []
        for (const sensesListItem in sensesList) {
            const english_definitions = sensesList[sensesListItem].english_definitions
            for (const item in english_definitions) {
                result.push(english_definitions[item])
            }
        }

        return result
    }

    const showPartsOfSpeech = (parts_of_speech) => {
        let result = ""

        for (const item in parts_of_speech) {
            result = result + `${parts_of_speech[item]}` + ", "
        }

        result = result.slice(0, -2)

        return (
            <div className="word-type">{result}</div>
        )
    }

    const showEnglishDefinition = (sensesList) => {
        const english_definitions = getEnglisDefinitionList(sensesList)

        let result = ""

        for (const item in english_definitions) {
            result = result + `${english_definitions[item]}` + ", "
        }

        result = result.slice(0, -2)


        return (
            <div className="word-meaning">{result}</div>
        )

    }

    const showExample = () => {
        return (
            <div>
                <div className="word-example">Example example example example example example</div>
                <div className="word-example-meaning">Example example example example example example</div>
            </div>
        )
    }

    const showFolderList = () => {
        return folderList.map(item => {
            return (
                <a className="list-group-item list-group-item-action search-bar-item" onClick={() => addNewWordToFolder(item)} data-dismiss="modal">
                    <i className="fas fa-folder mr-3"></i>

                    {item.name}
                </a>
            )
        })
    }

    const handleChangeNewFolder = (e) => {
        e.preventDefault()
        const { value } = e.target
        setNewFolder(value)

    }

    const createNewFolder = async () => {
        if (newFolder) {
            const createRequest = {
                visibility: true,
                name: newFolder
            }

            const res = await axios.post(`http://kanben-deploy.herokuapp.com/folder/`, createRequest, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })

            if (res) {
                const resData = res.data
                if (resData) {
                    toast.success("Created successful!", {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    await addNewWordToFolder(resData.data)
                    await fetchMyFolderList()
                }
            }

            setNewFolder("")
        }
        else {
            console.log("haven't filled name yet")
        }
    }

    const cancelCreateNewFolder = () => {
        setNewFolder("")
    }

    const addNewWordToFolder = async (folder) => {
        const reading = showedResult.japanese.map(item => {
            return item.reading
        })

        const postRequest = {
            folders: folder.id,
            vocabulary: showedResult.slug,
            definitions: {
                english_definitions: getEnglisDefinitionList(showedResult.senses)
            },
            reading: {
                reading: reading
            }
        }

        const res = await axios.post(`http://kanben-deploy.herokuapp.com/search/`, postRequest, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })

        if (res) {
            toast.success("Added successful!", {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    return (
        <div className="home-page">
            <div className="row">
                <div className="col-sm-10">
                    <input type="text" className="form-control" placeholder="Search" name="newWord" value={newWord} onChange={hanldeSearchNewWordChange} />
                    {newWord &&
                        <div className="search-bar-drop-box">
                            {showRecommend()}
                        </div>
                    }
                </div>

                <div className="col-sm-1">
                    <div className="btn-group">
                        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Select language
                        </button>

                        <div className="dropdown-menu dropdown-menu-right">
                            <button className="dropdown-item" type="button">日本 - Vietnamese</button>
                            <button className="dropdown-item" type="button">Vietnamese - 日本</button>
                        </div>
                    </div>
                </div>
            </div>


            {showedResult.slug &&
                <div className="word-result">
                    <div className="row">
                        <div className="col-sm-11">
                            <div className="word-info">
                                <div className="word-japanese">{showedResult.slug}</div>

                                {showJapanesWord()}

                                {showSenses()}

                                {/* {showExample()} */}
                            </div>
                        </div>

                        {user.username &&
                            <div className="col-sm-1">
                                <div className="word-action">
                                    <i className="fas fa-volume-up mr-3"></i>

                                    <i className="fas fa-plus" data-toggle="modal" data-target="#exampleModalCenterAddToFolder"></i>

                                    <div className="modal fade" id="exampleModalCenterAddToFolder" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLongTitle">My folder</h5>

                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="add-folder-list">
                                                        <h6 className="search-bar-item mb-3">Choose a folder to add new word</h6>

                                                        {showFolderList()}
                                                    </div>
                                                </div>
                                                <div className="modal-footer flex-center">
                                                    <button type="button" className="btn btn-primary" data-dismiss="modal" data-toggle="modal" data-target="#exampleModalCenterCreateFolder">Create new</button>

                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal fade" id="exampleModalCenterCreateFolder" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLongTitle">New folder</h5>

                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>

                                                <div className="modal-body">
                                                    <input type="text" className="form-control" name="folderName" value={newFolder} onChange={handleChangeNewFolder} />
                                                </div>

                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" data-toggle="modal" data-target="#exampleModalCenterAddToFolder" onClick={cancelCreateNewFolder}>Close</button>

                                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={createNewFolder}>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </div>}
        </div>
    );
}

export default HomePage;