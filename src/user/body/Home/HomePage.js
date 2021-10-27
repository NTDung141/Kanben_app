import React, { useState } from 'react';
import "./HomePage.css"
import axios from 'axios'
import JishoAPI from 'unofficial-jisho-api'

function HomePage() {
    const jisho = new JishoAPI({ proxy: 'https://cors-anywhere.herokuapp.com/' });

    const [result, setResult] = useState([])
    const [showedResult, setShowedResult] = useState({ slug: "" })

    const [newWord, setNewWord] = useState("")

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
                    <button
                        type="button"
                        className="list-group-item list-group-item-action search-bar-item"
                        onClick={() => showChoosenWord(item)}
                    >
                        {item.slug}
                    </button>
                )
            })
        }
    }

    const showChoosenWord = (item) => {
        setNewWord("")
        console.log(item)
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
            const senses = showedResult.senses[0]
            return (
                <div>
                    <div className="word-type">{senses.parts_of_speech[0]}</div>
                    <div className="word-meaning">{senses.english_definitions[0]}</div>
                </div>
            )
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

            {/* <div className="word-result">

                {showedResult && <div className="word-japanese">{showedResult.slug}</div>}

                {showedResult && showJapanesWord()}

                {showedResult && showSenses()}

                <div className="word-example">asdfasfasdfasdfasdfasdfasdfasdfasdf</div>
                <div className="word-example-meaning">asdfasdfasdfasdfasdfasdfasdf</div>
            </div> */}

            {showedResult.slug &&
                <div className="word-result">
                    <div className="word-japanese">{showedResult.slug}</div>

                    {showJapanesWord()}

                    {showSenses()}
                </div>}
        </div>
    );
}

export default HomePage;