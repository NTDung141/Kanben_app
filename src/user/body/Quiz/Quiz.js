import React, { useEffect, useState } from 'react';
import "./Quiz.css"
import axios from 'axios';
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom"

function Quiz(props) {
    const folderId = props.match.params.id

    const token = Cookies.get('KB-Token')

    const [folder, setFolder] = useState({})
    const [shuffledList, setShuffledList] = useState([])
    const [quizIndex, setQuizIndex] = useState(0)
    const [checkCurrentAnswer, setCheckCurrentAnswer] = useState(false)
    const [answerList, setAnswerList] = useState([])
    const [correctNumber, setCorrectNumber] = useState(0)
    const [isEnded, setIsEnded] = useState(false)

    // useEffect(async () => {
    //     const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, {
    //         headers: {
    //             'Authorization': `Token ${token}`
    //         }
    //     })

    //     if (res) {
    //         if (res.data) {
    //             if (res.data.data) {
    //                 const gettedFolder = res.data.data
    //                 setFolder(gettedFolder)
    //                 setShuffledList(createShuffledList(gettedFolder.list_vocabularies))
    //             }
    //         }
    //     }
    // }, [])

    useEffect(async () => {
        // const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`, {
        //     headers: {
        //         'Authorization': `Token ${token}`
        //     }
        // })
        const res = await axios.get(`https://kanben-deploy.herokuapp.com/folder/${folderId}`)

        if (res) {
            if (res.data) {
                if (res.data.data) {
                    const gettedFolder = res.data.data
                    setFolder(gettedFolder)
                    setShuffledList(createShuffledList(gettedFolder.list_vocabularies))
                    console.log(res.data)
                }
            }
        }
    }, [folderId])

    useEffect(() => {
        getAnswerList()
    }, [shuffledList])

    useEffect(() => {
        getAnswerList()
    }, [quizIndex])

    const showQuizContent = () => {
        if (shuffledList && shuffledList.length > 3 && shuffledList[quizIndex]) {
            return (
                <div className="quiz-content">
                    <div className="quiz-question"> {shuffledList[quizIndex].vocabulary} </div>
                    <div className="quiz-answer">
                        {showQuizAnswer()}
                    </div>
                </div>
            )
        }
    }

    const showQuizAnswer = () => {
        console.log(answerList)
        if (answerList.length > 0) {
            return answerList.map((item, index) => {
                if (!checkCurrentAnswer) {
                    console.log(item)
                    return (
                        <div className="quiz-answer-item" onClick={() => checkCorrect(item, index)}>{item.word.reading ? item.word.reading.reading[0] : ""}</div>
                    )
                }
                else {
                    if (item.checkCorrect) {
                        return (
                            <div className="quiz-answer-item quiz-answer-item-true">{item.word.reading ? item.word.reading.reading[0] : ""}</div>
                        )
                    }
                    else if (index === checkCurrentAnswer.choosenIndex) {
                        return (
                            <div className="quiz-answer-item quiz-answer-item-false">{item.word.reading.reading[0]}</div>
                        )
                    }
                    else {
                        return (
                            <div className="quiz-answer-item">{item.word.reading.reading[0]}</div>
                        )
                    }
                }
            })
        }
    }

    const getAnswerList = () => {
        const shuffledListLength = shuffledList.length
        if (shuffledListLength > 0) {
            let randomIndexList = [quizIndex]

            while (randomIndexList.length < 4) {
                const randomIndex = getRandomIndex(shuffledListLength)
                if (randomIndexList.indexOf(randomIndex) === -1) {
                    randomIndexList.push(randomIndex)
                }
            }

            randomIndexList = randomIndexList.sort((a, b) => 0.5 - Math.random())

            const result = randomIndexList.map(item => {
                if (item === quizIndex) {
                    return ({
                        word: shuffledList[item],
                        checkCorrect: true
                    })
                }
                else {
                    return ({
                        word: shuffledList[item],
                        checkCorrect: false
                    })
                }

            })

            setAnswerList(result)
        }
    }

    const checkCorrect = (item, index) => {
        if (!checkCurrentAnswer) {
            setCheckCurrentAnswer({
                choosenIndex: index,
            })
        }

        if (item.checkCorrect) {
            setCorrectNumber(correctNumber + 1)
        }
    }

    const getRandomIndex = (length) => {
        return Math.floor(Math.random() * length)
    }

    const createShuffledIndex = (vocabularyList) => {
        if (vocabularyList && vocabularyList.length > 3) {
            const n = vocabularyList.length
            let foo = Array.from({ length: n }, (_, i) => i + 1)
            foo = foo.sort((a, b) => 0.5 - Math.random());
            return foo
        }
    }

    const createShuffledList = (vocabularyList) => {
        const shuffledIndex = createShuffledIndex(vocabularyList)
        if (shuffledIndex) {
            const result = shuffledIndex.map(item => {
                return vocabularyList[item - 1]
            })
            return result
        }
    }

    const onNextQuiz = (index) => {
        if (shuffledList && quizIndex < shuffledList.length - 1) {
            console.log("next")
            setQuizIndex(index)
            setCheckCurrentAnswer(false)
        }

        if (index === shuffledList.length) {
            setIsEnded(true)
        }
    }

    const endModal = () => {
        return (
            <div className="quiz-content">
                <div className="quiz-point">
                    <h1>{"Correct: " + correctNumber + "/" + shuffledList.length}</h1>
                </div>

                <div className="quiz-end-action">
                    <button className="btn btn-primary mr-3" onClick={doAgain}>Again</button>
                    <NavLink className="btn btn-danger" to={`/folder-detail/${folderId}`}>Exit</NavLink>
                </div>
            </div>
        )
    }

    const doAgain = () => {
        setShuffledList(createShuffledList(folder.list_vocabularies))
        setQuizIndex(0)
        setCheckCurrentAnswer(false)
        setAnswerList([])
        setCorrectNumber(0)
        setIsEnded(false)
    }

    return (
        <div className="bg-color">
            <div className="quiz-page">
                <div className="quiz-modal">
                    <div className="quiz-modal-header">
                        <div className="quiz-number">{!isEnded ? (quizIndex + 1) + "/" + shuffledList.length : ""}</div>

                        <div className="quiz-exit-icon">
                            <NavLink className="fas fa-times" to={`/folder-detail/${folderId}`}></NavLink>
                        </div>
                    </div>

                    {isEnded ? endModal() : showQuizContent()}

                    {!isEnded &&
                        <div className="quiz-footer">
                            <div className="quiz-correct-number">{"Correct: " + correctNumber + "/" + shuffledList.length}</div>

                            <div className="quiz-next-btn">
                                <button className="btn btn-primary" onClick={() => onNextQuiz(quizIndex + 1)}>Next</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Quiz;