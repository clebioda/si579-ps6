function WordItem(props) {
    return (<li>{props.word} <button type='button' className='btn btn-outline-success' onClick={props.onClick}>(save)</button></li>)
}

export default WordItem;