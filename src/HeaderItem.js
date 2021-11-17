function HeaderItem(props) {
    function addS(num) {
        if (num === 1) {
          return "";
        } else {
          return "s";
        }
    }

     return(
        <h3>{`${props.text} syllable${addS(parseInt(props.text))}:`}</h3>
    );
}

    export default HeaderItem;