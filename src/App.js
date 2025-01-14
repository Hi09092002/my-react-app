import './App.css';
import { Box, Heading, Badge, Flex, Text, useToast } from '@chakra-ui/react';
import { Setting } from './components/Setting';
import { QuestionsLog } from './components/QuestionsLog';
import { ControlPanel } from './components/ControlPanel';
import { useQuestionList } from './useQuestionList';
import { useSetting } from './hooks/useSetting';
import { useHistory } from './hooks/useHistory';
import { ChoicePanel } from './components/ChoicePanel';
import { useTechnicalTerm } from './useTechnicalTerm';
import { useState, useEffect } from 'react'; // useState, useEffect をインポート

function App() {
  const toast = useToast();
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let inputSequence = [];
  const [hiddenMessage, setHiddenMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      inputSequence.push(event.key);
      inputSequence = inputSequence.slice(-konamiCode.length);

      if (inputSequence.join(',') === konamiCode.join(',')) {
        setHiddenMessage('ｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!');
        toast({
          title: "隠しコマンド成功！",
          description: "もしかして君もゲームが大好き？",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toast]);

  const { showQuestionList } = useQuestionList();
  const questionList = showQuestionList();
  const { showTechnicalTerm } = useTechnicalTerm();
  const technicalTerm = showTechnicalTerm();
  const {
    showSettingDetail,
    updateQuestionOrder,
    toggleQuestionRange,
    updateQuestionMode,
    makeSetting,
    addWordFilter,
    deleteWordFilter,
    updateAllSettings,
  } = useSetting();
  let settingDetail = showSettingDetail();
  const {
    showHistory,
    selectQuestionList,
    nextQuestion,
    checkAnswer,
    hideAnswer,
    reviewQuestion,
    reviewAskingQuestion,
    loadHistory,
  } = useHistory();
  const history = showHistory();
  const thisAppNameTag = 'anywhere-Insulin19220111';
  let loadData = {
    app: `${thisAppNameTag}`,
    latestUpdate: new Date().getTime(),
  };
  if (localStorage.getItem(thisAppNameTag)) {
    loadData = JSON.parse(localStorage.getItem(thisAppNameTag));
  }
  const saveHistory = (latestHistory, newSetting) => {
    let savingHistory = '';
    if (latestHistory && latestHistory.remainingQuestionList) {
      savingHistory = latestHistory.questionNum + ',';
      latestHistory.remainingQuestionList.forEach((question) => {
        savingHistory += question.id;
        savingHistory += ',';
      });
      savingHistory = savingHistory.substring(0, savingHistory.length - 1);
    }
    let jsonData = {
      app: `${thisAppNameTag}`,
      latestUpdate: new Date().getTime(),
      status: newSetting,
      history: savingHistory,
    };
    localStorage.setItem(thisAppNameTag, JSON.stringify(jsonData));
    console.log(localStorage.getItem(thisAppNameTag));
  };

  return (
    <>
      <Heading mt={'3'} ml="3" color="teal" mb={0}>
        どこでも試験対策
      </Heading>
      {hiddenMessage && (
        <Box bg="yellow.100" p={4} my={4} borderRadius="md">
          <Text fontSize="lg" color="red.500">
            {hiddenMessage}
          </Text>
        </Box>
      )}
      <Flex>
        <Badge
          m={1}
          mr="0"
          mt={'0'}
          ml={3}
          borderRadius="full"
          px="2"
          colorScheme="teal"
          variant={'outline'}
        >
          Ver.2.0
        </Badge>
        <Badge m={1} mt="0" borderRadius="full" px="2" colorScheme="teal">
          生化学
        </Badge>
      </Flex>

      {settingDetail.isSet ? (
        <></>
      ) : (
        <Box maxW={'lg'} mr="auto" ml={'auto'}>
          <Setting
            toast={toast}
            questionList={questionList}
            loadData={loadData}
            history={history}
            saveHistory={saveHistory}
            showSettingDetail={showSettingDetail}
            updateQuestionOrder={updateQuestionOrder}
            toggleQuestionRange={toggleQuestionRange}
            updateQuestionMode={updateQuestionMode}
            selectQuestionList={selectQuestionList}
            nextQuestion={nextQuestion}
            makeSetting={makeSetting}
            addWordFilter={addWordFilter}
            deleteWordFilter={deleteWordFilter}
            updateAllSettings={updateAllSettings}
            loadHistory={loadHistory}
            technicalTerm={technicalTerm}
          />
        </Box>
      )}
      {settingDetail.isSet ? (
        <Box bgColor={'blackAlpha.100'} mt="-100px" pt={'100px'} minH="1500px">
          <Box maxW="2xl" mr="auto" ml={'auto'}>
            {/* <ResultBar
            showHistory={showHistory}
            showSettingDetail={showSettingDetail}
          /> */}
            <QuestionsLog
              // questionList={questionList}
              toast={toast}
              loadData={loadData}
              showHistory={showHistory}
              nextQuestion={nextQuestion}
              checkAnswer={checkAnswer}
              // hideAnswer={hideAnswer}
              showSettingDetail={showSettingDetail}
              reviewQuestion={reviewQuestion}
              reviewAskingQuestion={reviewAskingQuestion}
              saveHistory={saveHistory}
              technicalTerm={technicalTerm}
            />
            {settingDetail.mode === 'practice' &&
            history[history.length - 1].askingQuestion.choices.length > 1 ? (
              <ChoicePanel />
            ) : (
              <></>
            )}
            <Box h={'300px'} width="100px"></Box>
            <ControlPanel
              showSettingDetail={showSettingDetail}
              showHistory={showHistory}
            />
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
//   )
// }

export default App
