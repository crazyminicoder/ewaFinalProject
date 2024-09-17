import React from "react";
import { connect } from "react-redux";
import { Input, Spacer } from "@nextui-org/react";
import {ACTIONS} from '../action'

const SearchBox = ({handleSearch}) => {
  const handleChange =  (e) => {
    handleSearch(e.target.value)
  }
  return (
    <div style={{width: '50%', margin: 'auto', marginTop: '-60px', marginBottom: "40px"}}>
      <Input size="lg" fullWidth placeholder="Search fruits" onChange={handleChange}/>
    </div>
  );
};


const mapDispatchToProps = (dispatch) => ({
handleSearch: (searchText) => dispatch({
type: ACTIONS.SEARCH_PRODUCT,
payload: {
  searchText
}
})
})

export default connect(null, mapDispatchToProps)(SearchBox)