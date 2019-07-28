import React from 'react'
import { connect } from 'react-redux'
import { Message } from 'semantic-ui-react'

const Notification = (props) => {
  if (props.notification.message === null) {
    return null
  }

  return (
    <div>
      {(props.notification.type === 'success' &&
        <Message success>
          {props.notification.message}
        </Message>
      )}
      {(props.notification.type === 'error' &&
        <Message error>
          {props.notification.message}
        </Message>
      )}  
    </div>
  )
}

const mapStateToProps = (state) => {
  return { notification: state.notification }
}

export default connect(mapStateToProps)(Notification)