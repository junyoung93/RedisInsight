import React from 'react'
import { EuiToolTip, EuiIcon } from '@elastic/eui'
import { EntityInfo, EntityType } from './parser'

interface INodeProps {
  label: string
  numRecords?: string
  executionTime?: string
  snippet?: string
}


export function ExplainNode(props: INodeProps) {
  const propData: EntityInfo = (props as any).node.getData()
  const { id, type, data, snippet } = propData
  return (
    <div className="ExplainContainer" id={`node-${id}`}>
      <div className="Main">
        <div className="Info">
          <div>{data ? data : type}</div>
          {type === EntityType.Expr && <div className="Type">text</div> }
        </div>
      </div>
      {
        snippet && (
          <div className='Footer'>
            {snippet}
          </div>
        )
      }
    </div>
  )
}



interface INodeToolTip {
  content?: string
  items?: {[key: string]: string}
}

function NodeToolTipContent(props: INodeToolTip) {

  if (props.content !== undefined) {
    return <div className='NodeToolTip'>{props.content}</div>
  }

  if (props.items !== undefined) {
    let items = props.items
    return (
      <div className="NodeToolTip">
        {
          Object.keys(items).map(k => (
            <div className="NodeToolTipItem">{k}: {items[k]}</div>
          ))
        }
      </div>
    )
  }

  return null
}

export function ProfileNode(props: INodeProps) {
  const info: EntityInfo = (props as any).node.getData()
  const {id, data, type, snippet, time, counter, size, recordsProduced} = info

  let items = {}

  if (counter !== undefined) {
    items['Counter'] = counter
  }

  if (size !== undefined) {
    items['Size'] = size
  }

  const timeInFloat = parseFloat(time || '')
  const timeStyles = {
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: (timeInFloat > 45 ? 'red' : timeInFloat > 25 ? 'yellow' : ''),
  }

  return (
    <div className="ProfileContainer" id={`node-${id}`} data-size={counter || size || recordsProduced}>
      <div className="Main">
        <div>{data ? data : type}</div>
        <div className="Type">{[EntityType.GEO, EntityType.NUMERIC, EntityType.TEXT, EntityType.TAG].includes(type) ? type : ''}</div>
      </div>
      {
        snippet && (
          <div className='Footer'>
            {snippet}
          </div>
        )
      }
      <div className="MetaData">
        <EuiToolTip content={<NodeToolTipContent content={"Execution Time"} />}>
          <div className="Time" style={timeInFloat > 25 ? timeStyles : {}}>
            <div className="IconContainer"><EuiIcon className="NodeIcon" size="m" type="clock" /></div>
            <div>{time} ms</div>
          </div>
        </EuiToolTip>
        <EuiToolTip
          content={
            <NodeToolTipContent
              {...{
                items: recordsProduced === undefined ? items : undefined,
                content: recordsProduced ? 'Records produced' : undefined
              }}
            />
          }
        >
          <div className="Size">
            <div>{
              counter !== undefined ? counter :
                size !== undefined ? size : recordsProduced}</div>
            <div className="IconContainer"><EuiIcon className="NodeIcon" size="m" type="reportingApp" /></div>
          </div>
        </EuiToolTip>
      </div>
    </div>
  )
}
