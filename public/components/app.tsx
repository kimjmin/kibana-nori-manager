import React, { useState, Fragment } from 'react';
// import { i18n } from '@kbn/i18n';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  
  EuiPageContentHeaderSection,
  EuiFieldText,
  EuiSwitch, EuiSpacer,
  EuiRadioGroup, EuiRadio,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPanel,
  EuiTextArea, EuiComboBox,
  EuiFormRow,
  htmlIdGenerator,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME, PLUGIN_TITLE } from '../../common';

interface NoriManagerAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

/**
 * Decompound Mode ID 생성
 * Generate Decompound Mode ID
 */
const decMId = htmlIdGenerator();
import { POS_DATA } from '../resources/kr-pos';

export const NoriManagerApp = ({
  basename,
  notifications,
  http,
  navigation,
}: NoriManagerAppDeps)=>{

  const decMRadios = [
    {id: `${decMId}0`, label: 'none',},
    {id: `${decMId}1`, label: 'discard (default)',},
    {id: `${decMId}2`, label: 'mixed',},
  ];
  const decompModeTxtVal={
    [`${decMId}0`]: `["decompound_mode": "none"]

복합어를 분해하지 않고 그대로 저장합니다
서울대=>서울대`,
    [`${decMId}1`]: `["decompound_mode": "discard"]

복합어를 분해한 어근을 저장합니다
서울대=>서울, 대`,
    [`${decMId}2`]: `["decompound_mode": "mixed"]
  
복합어를 분해한 어근과 복합어를 모두 저장합니다
서울대=>서울대, 서울, 대`,
  };
  
  /**
   * nori_part_of_speech 토큰 필터 : stoptags 요소들. ../reousrces/kr-pos.json 파일 호출
   * nori_part_of_speech token filter : stoptags elements. Imported from ../reousrces/kr-pos.json
   */
  const posOptions = POS_DATA.DATA;
  const posDefault = POS_DATA.defalut_stoptags;

  /**
   * inputTxt : 분석할 텍스트값 - Text to analysis value
   * indexName : (임시) 인덱스명 - Index name value
   * dec* : decompound_mode 관련 요소 - decompound_mode settings form elements
   * uDict* : 사용자 사전 관련 요소 - user dictionary settings form elements
   * pos* : nori_part_of_speech 토큰 필터 관련 요소 - nori_part_of_speech form elements
   * readF : nori_readingform 토큰 필터 관련 요소 - nori_readingform form elements
   */
  const state = {
    indexName: '',
    inputTxt: '',
    decMRadioIdSelected: `${decMId}1`, decompModeTxt: decompModeTxtVal[`${decMId}1`],
    uDictChecked: false, uDictPanChecked: true, uDictRulePanChecked: false, uDictPath: '', uDictWords: [],
    posStoptagsChecked: false, posSelectedOpts: posDefault, posError: undefined,
    readFChecked: false,
  };

  /**
   * 인덱스명 폼 이벤트
   * Index Name form event
   */
  const [indexName, setIndexName] = useState(state.indexName);
  const onIndexNameChange = (e)=>{
    state.indexName = e.target.value;
    setIndexName(state.indexName);
    // console.log(state.indexName);
  };

  /**
   * 분석할 텍스트값 폼 이벤트
   * Text to analysis form event
   */
  const [inputTxt, setInputTxt] = useState(state.inputTxt);
  const onInputTxtChange = (e)=>{
    state.inputTxt = e.target.value;
    setInputTxt(state.inputTxt);
    // console.log(state.inputTxt);
  };

  /**
   * decompound_mode (none, discard, mixed) 설정 라디오 버튼 이벤트
   * decompound_mode (none, discard, mixed) radio buttons event
   */
  const [decMRadioIdSelected, setDecMRadioIdSelected] = useState(state.decMRadioIdSelected);
  const onDecMRadioChange = (decMRadioId)=>{
    state.decMRadioIdSelected = decMRadioId;
    setDecMRadioIdSelected(state.decMRadioIdSelected);
    // console.log(state.decMRadioIdSelected);
    onDecompModeTxtChange(decMRadioId);
  };
  const [decompModeTxt, setDecompModeTxt] = useState(state.decompModeTxt);
  const onDecompModeTxtChange = (decMRadioId)=>{
    state.decompModeTxt = decompModeTxtVal[decMRadioId];
    setDecompModeTxt(state.decompModeTxt);
    // console.log(state.decompModeTxt);
  };

  /**
   * 사용자 정의 사전 사용 스위치 이벤트
   * user_dictionary switch event
   */
  const [uDictChecked, setUserDictChange] = useState(state.uDictChecked);
  const onSetUserDictChange = (e)=>{
    state.uDictChecked = e.target.checked;
    setUserDictChange(state.uDictChecked);
    // console.log(state.uDictChecked);
  };

  /**
   * user_dictionary, user_dictionary_rules 라디오 버튼 이벤트
   * radio button event on user_dictionary, user_dictionary_rules
   */
  const [uDId] = useState(htmlIdGenerator());
  const [uDRId] = useState(htmlIdGenerator());
  const [uDictPanChecked, setUDictPanChecked] = useState(state.uDictPanChecked);
  const [uDictRulePanChecked, setUDictRulePanChecked] = useState(state.uDictRulePanChecked);
  const onUDictPanChange = (isUdict)=>{
    state.uDictPanChecked = isUdict
    state.uDictRulePanChecked = !isUdict
    setUDictPanChecked(state.uDictPanChecked);
    setUDictRulePanChecked(state.uDictRulePanChecked);
  };

  /**
   * 저장된 사전 파일 경로 패스 입력 폼 이벤트
   * user_dictionary path input form event
   */
  const [uDictPath, setUDictPath] = useState(state.uDictPath);
  const onUDictPathChange = (e)=>{
    state.uDictPath = e.target.value;
    setUDictPath(state.uDictPath);
    // console.log(state.uDictPath);
  };

  /**
   * 사전 직접 입력 폼 이벤트
   * user_dictionary_rules input form events
   */
  const [uDictWords, setUDictWords] = useState(state.uDictWords);
  const onUDictWordsCreateOption = (searchValue) => {
    const newOption = {
      label: searchValue,
    };
    state.uDictWords = [...uDictWords, newOption];
    // Select the option.
    setUDictWords(state.uDictWords);
    // console.log(state.uDictWords);
  };
  const onUDictWordsChange = (selectedOptions) => {
    state.uDictWords = selectedOptions;
    setUDictWords(state.uDictWords);
    // console.log(state.uDictWords);
  };

  /**
   * nori_part_of_speech stoptags 스위치 이벤트
   * nori_part_of_speech stoptags switch event
   */
  const [posStoptagsChecked, setStoptagsChecked] = useState(state.posStoptagsChecked);
  const onStoptagsChange = (e)=>{
    state.posStoptagsChecked = e.target.checked;
    setStoptagsChecked(state.posStoptagsChecked);
  };

  /**
   * nori_part_of_speech : stoptags 입력 폼 이벤트들
   * nori_part_of_speech : stoptags input form events
   */
  const [allPosOpts] = useState(posOptions);
  const [posSelectedOpts, setPosSelectedOpts] = useState(state.posSelectedOpts);
  const [posError, setPosError] = useState(state.posError);
  const [posInputRef, setPosInputRef] = useState(undefined);
  const onPosChange = (selectedOptions) => {
    state.posError = undefined;
    state.posSelectedOpts = selectedOptions;
    setPosError(state.posError);
    setPosSelectedOpts(state.posSelectedOpts);
  };
  const onPosSearchChange = (value, hasMatchingOptions) => {
    state.posError = value.length === 0 || hasMatchingOptions ? undefined : `"${value}" 는 유효하지 않은 옵션입니다.`;
    setPosError(state.posError);
  };
  const onPosBlur = () => {
    if (posInputRef) {
      const { value } = posInputRef;
      state.posError = value.length === 0 ? undefined : `"${value}" 는 유효하지 않은 옵션입니다.`;
      setPosError(state.posError);
    }
  };

  /**
   * nori_readingform 스위치 이벤트
   * nori_readingform switch event
   */
  const [readFChecked, setReadFChecked] = useState(state.readFChecked);
  const onReadFChange = (e)=>{
    state.readFChecked = e.target.checked;
    setReadFChecked(state.readFChecked);
  };

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
        <EuiPage restrictWidth="1000px">
          <EuiPageBody>
            <EuiPageHeader>
              <EuiTitle size="m">
                <h1>
                  <FormattedMessage
                    id="noriManager.helloWorldText"
                    defaultMessage="{title}"
                      values={{ title: PLUGIN_TITLE }}
                  />
                </h1>
              </EuiTitle>
            </EuiPageHeader>

            <EuiPageContent>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <Fragment>
                    <EuiPageContentBody>
                      <EuiText>

<h2>인덱스명 (Index Name)</h2>
<EuiFieldText
  placeholder="인덱스명 (Index Name)"
  value={indexName}
  onChange={(e)=>onIndexNameChange(e)}
  />

<h2>분석할 텍스트 (Text to analyze)</h2>
<div>
  <EuiFlexGroup>
    <EuiFlexItem>
      <EuiTextArea
      fullWidth={true}
      placeholder="분석할 텍스트를 입력하세요"
      aria-label="Text to analysis"
      value={inputTxt}
      onChange={(e)=>onInputTxtChange(e)}
      />
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiButton fill onClick={()=>window.alert('Button clicked')}>Analyze!!</EuiButton>
    </EuiFlexItem>
  </EuiFlexGroup>
</div>

<h2>Analyzer 설정</h2>

<h3>Tokenizer</h3>
<EuiPageContent>
  <EuiPageContentHeader>
    <EuiPageContentHeaderSection>
      <EuiTitle>
<h3>nori_tokenizer</h3>
      </EuiTitle>
    </EuiPageContentHeaderSection>
  </EuiPageContentHeader>
  <EuiPageContentBody>
<h4>decompound_mode</h4>
    <div>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
        <EuiRadioGroup
          options={decMRadios}
          idSelected={decMRadioIdSelected}
          onChange={(id)=>onDecMRadioChange(id)}
        />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel paddingSize="none">
            <pre style={{margin:0}}>{decompModeTxt}</pre>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>

    <h4>
      <EuiSwitch
      label="사용자 정의 사전 사용"
      checked={uDictChecked}
      onChange={(e)=>onSetUserDictChange(e)}
      />
    </h4>
    <EuiPanel paddingSize="s">
      <h4>
        <EuiRadio
        id={uDId}
        label="user_dictionary"
        checked={uDictPanChecked}
        onChange={(e)=>onUDictPanChange(e.target.checked)}
        compressed
        disabled={!uDictChecked}
        />
      </h4>
      <p>저장된 사전 파일을 사용합니다</p>
      <EuiFieldText
      prepend="$ES_HOME/config/"
      placeholder="사전 파일 경로"
      value={uDictPath}
      onChange={(e)=>onUDictPathChange(e)}
      disabled={!(uDictChecked && uDictPanChecked)}
      fullWidth
      />
    </EuiPanel>
    <EuiSpacer size="m" />
    <EuiPanel paddingSize="s">
      <h4>
      <EuiRadio
      id={uDRId}
      label="user_dictionary_rules"
      checked={uDictRulePanChecked}
      onChange={(e)=>onUDictPanChange(!e.target.checked)}
      compressed
      disabled={!uDictChecked}
      />
      </h4>
      <p>Index Settings 설정에 직접 사전을 입력합니다</p>
      <EuiComboBox
      noSuggestions
      placeholder="사전을 등록하세요 (입력 후 엔터)"
      selectedOptions={uDictWords}
      onCreateOption={onUDictWordsCreateOption}
      onChange={onUDictWordsChange}
      isDisabled={!(uDictChecked && uDictRulePanChecked)}
      />
    </EuiPanel>

  </EuiPageContentBody>
</EuiPageContent>

<h3>Token Filters</h3>
<EuiPageContent>
  <EuiPageContentHeader>
    <EuiPageContentHeaderSection>
      <EuiTitle>
<h3>nori_part_of_speech</h3>
      </EuiTitle>
    </EuiPageContentHeaderSection>
  </EuiPageContentHeader>
  <EuiPageContentBody>

<h4>
<EuiSwitch
label="stoptags"
checked={posStoptagsChecked}
onChange={(e)=>onStoptagsChange(e)}
/>
</h4>
  <EuiFormRow fullWidth={true} error={posError} isInvalid={posError !== undefined}>
    <EuiComboBox
      fullWidth={true}
      placeholder="제거할 POS TAG를 입력하세요"
      options={allPosOpts}
      selectedOptions={posSelectedOpts}
      inputRef={setPosInputRef}
      onChange={onPosChange}
      onSearchChange={onPosSearchChange}
      onBlur={onPosBlur}
      isDisabled={!posStoptagsChecked}
    />
  </EuiFormRow>

  </EuiPageContentBody>
  <EuiSpacer size="xl" />
  <EuiPageContentHeader>
    <EuiPageContentHeaderSection>
      <EuiTitle>
<h3>nori_readingform</h3>
      </EuiTitle>
    </EuiPageContentHeaderSection>
  </EuiPageContentHeader>
  <EuiPageContentBody>
  <EuiSwitch
  label="nori_readingform 사용"
  checked={readFChecked}
  onChange={onReadFChange}
  />
  </EuiPageContentBody>
</EuiPageContent>

                      </EuiText>
                    </EuiPageContentBody>
                  </Fragment>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>

        </>
      </I18nProvider>
    </Router>
  );
};
