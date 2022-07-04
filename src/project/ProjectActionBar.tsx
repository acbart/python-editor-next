/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { BoxProps, HStack, VStack } from "@chakra-ui/react";
import SendButton from "./SendButton";
import DownloadMenuButton from "./DownloadMenuButton";
import OpenButton from "./OpenButton";
import RunButton from "./RunButton";
import { useEngineData } from "../engine/engine-hooks";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ProjectActionBar = (props: BoxProps) => {
  const engine = useEngineData();
  const size = "lg";
  return (
    <VStack>
      <HStack
        {...props}
        justifyContent="space-between"
        pt={5}
        pb={5}
        pl={10}
        pr={10}
      >
        <RunButton size={size}/>
        <SendButton size={size} />
        <HStack spacing={2.5}>
          <DownloadMenuButton size={size} />
          {/* Min-width to avoid collapsing when out of space. Needs some work on responsiveness of the action bar. */}
          <OpenButton mode="button" size={size} minW="fit-content" />
        </HStack>
      </HStack>
      <HStack
        {...props}
        justifyContent="space-between"
        pt={5}
        pb={5}
        pl={10}
        pr={10}
      >
        <div>
          <strong>Console</strong><br/>
          <div style={{backgroundColor: 'white', borderColor: '1px solid black'}}>
            { engine.state.console.map((line: string, index: number) =>
              <div style={{borderBottom: '1px dashed gray'}} key={index}>{line}</div>)}
          </div>
        </div>
        <div>
          <strong>Feedback: {engine.state.feedbackTitle}</strong><br/>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} >{engine.state.feedbackMessage}</ReactMarkdown>
        </div>
      </HStack>
    </VStack>
  );
};

export default ProjectActionBar;
