import { type FC } from "react";
import { Handle, Position } from "reactflow";
import ChatIcon from "../icons/ChatIcon";
import WhatsappIcon from "../icons/WhatsappIcon";

type NodeHeaderProps = {
  data: {
    heading: string;
    label: string;
  };
  isConnectable: boolean;
};

export const NodeHeader: FC<NodeHeaderProps> = ({ data, isConnectable }) => {
  return (
    <div className="text-updater-node">
      <div>
        <div className="node_header_heading">
          <div className="node_header_text_icon">
            <span>
              <ChatIcon className="chat_icon_black" />
            </span>
            <h4>{data?.heading}</h4>
          </div>

          <span className="whatapp_icon_bg">
            <WhatsappIcon />
          </span>
        </div>

        <div className="node_header_label">
          <h5>{data?.label}</h5>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
};
