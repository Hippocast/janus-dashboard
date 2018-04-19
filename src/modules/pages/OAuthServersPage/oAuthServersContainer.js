import { connect } from 'react-redux'

import {
  deleteOAuthServer,
  fetchOAuthServers,
  setOAuthServersAscendingFilter,
  setCurrentPageIndex,
  setOAuthServersSortingFilter,
  confirmAction
} from '../../../store/actions'
import { filteredOAuthServersList } from '../../../store/selectors'

import OAuthServersList from './OAuthServersList'

const mapStateToProps = state => ({
  oAuthServers: filteredOAuthServersList(state),
  currentPageIndex: state.paginationReducer.currentPageIndex,
  searchQuery: state.searchReducer.searchQuery,
  isAdmin: state.userSessionReducer.isAdmin
})

export default connect(
  mapStateToProps,
  {
    deleteOAuthServer,
    fetchOAuthServers,
    setAscendingFilter: setOAuthServersAscendingFilter,
    setCurrentPageIndex,
    setSortingFilter: setOAuthServersSortingFilter,
    confirmAction
  }
)(OAuthServersList)
