/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useDnD } from "@wso2is/dnd";
import {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    Node,
    OnConnect,
    OnNodesDelete,
    ReactFlow,
    ReactFlowProps,
    XYPosition,
    addEdge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import React, { DragEvent, FC, FunctionComponent, ReactElement, useCallback } from "react";
import StepNode, { StepNodePropsInterface } from "./nodes/step-node";
import useAuthenticationFlowBuilderCore from "../hooks/use-authentication-flow-builder-core-context";
import { ElementCategories } from "../models/elements";
import "@xyflow/react/dist/style.css";
import "./visual-flow.scss";

/**
 * Props interface of {@link VisualFlow}
 */
export type VisualFlowPropsInterface = IdentifiableComponentInterface & ReactFlowProps<any, any>;

// NOTE: `nodeTypes` are defined outside of the component to prevent re-renderings.
const nodeTypes: {
    STEP: FC<StepNodePropsInterface>;
} = { STEP: StepNode };

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const VisualFlow: FunctionComponent<VisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-flow",
    ...rest
}: VisualFlowPropsInterface): ReactElement => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const { node, generateComponentId } = useDnD();
    const { onElementDropOnCanvas } = useAuthenticationFlowBuilderCore();

    const onDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!node?.type || node?.category !== ElementCategories.Nodes) {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position: XYPosition = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });

            const newNode: Node = {
                data: {
                    label: `${node.type} node`,
                    ...node
                },
                id: generateComponentId(),
                position,
                type: node.type as string
            };

            setNodes((nodes: Node[]) => nodes.concat(newNode));

            onElementDropOnCanvas(node, null);
        },
        [ screenToFlowPosition, node?.type ]
    );

    const onConnect: OnConnect = useCallback((params: any) => setEdges((edges: Edge[]) => addEdge(params, edges)), []);

    const onNodesDelete: OnNodesDelete<Node> = useCallback(
        (deleted: Node[]) => {
            setEdges(
                deleted.reduce((acc: Edge[], node: Node) => {
                    const incomers: Node[] = getIncomers(node, nodes, edges);
                    const outgoers: Node[] = getOutgoers(node, nodes, edges);
                    const connectedEdges: Edge[] = getConnectedEdges([ node ], edges);

                    const remainingEdges: Edge[] = acc.filter(
                        (edge: Edge) => !connectedEdges.includes(edge)
                    );

                    const createdEdges: Edge[] = incomers.flatMap(({ id: source }: { id: string }) =>
                        outgoers.map(({ id: target }: { id: string }) => ({
                            id: `${source}->${target}`,
                            source,
                            target
                        }))
                    );

                    return [ ...remainingEdges, ...createdEdges ];
                }, edges)
            );
        },
        [ nodes, edges ]
    );

    return (
        <ReactFlow
            fitView
            nodes={ nodes }
            edges={ edges }
            nodeTypes={ nodeTypes as any }
            onNodesChange={ onNodesChange }
            onEdgesChange={ onEdgesChange }
            onConnect={ onConnect }
            onNodesDelete={ onNodesDelete }
            onDrop={ onDrop }
            onDragOver={ onDragOver }
            proOptions={ { hideAttribution: true } }
            data-componentid={ componentId }
            colorMode="dark"
            { ...rest }
        >
            <Background gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
            <Controls position="top-right" />
        </ReactFlow>
    );
};

export default VisualFlow;
