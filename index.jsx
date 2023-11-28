import React, { useState, useEffect } from "react";
import { render } from 'react-dom';

function useIncrement (initialValue = 0, step = 1){
    const [count, setCount] = useState(initialValue)

    const increment = function () {
        setCount(c => c + 1)
    }

    return [
        count,
        increment
    ]

}

function useAutoIncrement (initialValue = 0, step = 1) {
    const [count, setCount] = useState(initialValue)
    useEffect(function (){
        const timer = window.setInterval(function (){
            setCount(c => c + step)
        }, 1000)

        return function (){
            clearInterval(timer)
        }    
    }, [])
    return count
}

function useToggle (initialValue = true) {
    const [value, setValue] = useState(initialValue)
    const toggle = function (){
        setValue(v => !v)
    }
    return [value, toggle]
}

function Compteur () {
    const count = useAutoIncrement(0, 10)

    return <button>Incrementer {count}</button>
}

// Une fonction qui permet d'utiliser des checkbox
function App () {

    const [compteurVisible, toggleCompteur] = useToggle(true)
    return <div>
        Afficher le Compteur
        <input type="checkbox" onChange={toggleCompteur} checked={compteurVisible}/> 
        <br/>
        {compteurVisible && <Compteur/>}
        <TodoList/>
        <PostTable/>
    </div>
}

function useFetch (url) {
    const [state, setState] = useState({
        items: [],
        loading: true
    })

    useEffect(function () {
        (async function (){
            const response = await fetch(url)
            const responseData = await response.json()
            if(response.ok) {
                setState({
                    items: responseData,
                    loading: false
                })
            } else {
                alert(JSON.stringify(responseData))
                setLoding(s => ({...s, loading: false}))
            }
        })()
    }, [])
    return [
        state.loading,
        state.items
    ]
}

function PostTable () {
    const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/comments?_limit=10')

    if (loading) {
        return 'Chargement...'
    }

    return <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Contenu</th>
            </tr>
        </thead>
        <tbody>
            {items.map(item =><tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.body}</td>
            </tr>)}
        </tbody>
    </table>
}

function TodoList () {
    const [loading, items] = useFetch('https://jsonplaceholder.typicode.com/todos?_limit=10')



    if (loading) {
        return 'Chargement...'
    }

    return <ul>
        {items.map(t => <li key={t.id}>{t.title}</li>)}
    </ul>
}

//premiere methode
/*
function PostTable () {
    const [items, setItems] = useState([])
    const [loading, setLoding] = useState(true)
    console.log('render')

    useEffect(function () {
        (async function (){
            const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=10')
            const responseData = await response.json()
            if(response.ok) {
                setItems(responseData)
            } else {
                alert(JSON.stringify(responseData))
            }
            setLoding(false)
        })()
    }, [])

    if (loading) {
        return 'Chargement...'
    }

    return <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Contenu</th>
            </tr>
        </thead>
        <tbody>
            {items.map(item =><tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.body}</td>
            </tr>)}
        </tbody>
    </table>
}

function TodoList () {
    const [todos, setTodos] = useState([])
    const [loading, setLoding] = useState(true)
    console.log('render')

    useEffect(function () {
        (async function (){
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
            const responseData = await response.json()
            if(response.ok) {
                setTodos(responseData)
            } else {
                alert(JSON.stringify(responseData))
            }
            setLoding(false)
        })()
    }, [])

    if (loading) {
        return 'Chargement...'
    }

    return <ul>
        {todos.map(t => <li key={t.id}>{t.title}</li>)}
    </ul>
}
*/

render (
    <App/>,
    document.getElementById('app')
)
