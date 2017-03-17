import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  addTab,
  addSurvey,
  addSingleInput,
  addRadioGroup,
  addDropdown,
  addCheckbox,
  addRating,
  addComment,
  deleteSurvey,
  focusTab,
  deleteTab,
  moveSurvey
 } from '../modules/SurveyReducers';

import SurveyBuilder from '../components/SurveyBuilder';

const tabsArray = state => state.tabs;
const pagesObject = state => state.entities.pages;
const questionsObject = state => state.entities.questions;
// const triggersObject = state => state.entities.triggers;
const selectedTab = state => state.ui.surveyTab.selectedTab;

const getTabs = createSelector(
  [tabsArray, pagesObject],
  (tabs, pages) => {
    return tabs.map(
      tab => ({
        id: tab,
        name: pages[tab].name
      })
    )
  }
)

const getQuestions = createSelector(
  [ questionsObject, selectedTab, pagesObject ],
  (questions, tab, pages) => {
    if(Object.keys(pages).length ){
      const questionsInTab = pages[tab].questions;

      const questionsArray = questionsInTab.map(
        id => ({
          questionModel: questions[id],
          id
        })
      )

      return questionsArray;
    }

    return [];
  }
);

const mapStateToProps = (state) => {
    return {
      tabs: getTabs(state),
      questions: getQuestions(state),
      selectedTab: selectedTab(state), //todo preview model
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      handleSurveyDelete: (id, tab, validators, choices) => {
        dispatch(deleteSurvey(id, tab, validators, choices))
      },
      handleAddNewTab: () => {
        dispatch(addTab())
      },
      handleFocusTab: id => {
        dispatch(focusTab(id))
      },
      addButtonActions:[
         {
           color: 'primary',
           name: 'S',
           action: (tabId, surveyId) => {
             dispatch(addSingleInput(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         },
         {
           color: 'primary',
           name: 'Rd',
           action: (tabId, surveyId) => {
             dispatch(addRadioGroup(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         },
         {
           color: 'primary',
           name: 'D',
           action: (tabId, surveyId) => {
             dispatch(addDropdown(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         },
         {
           color: 'primary',
           name: 'Ck',
           action: (tabId, surveyId) => {
             dispatch(addCheckbox(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         },
         {
           color: 'primary',
           name: 'Rt',
           action: (tabId, surveyId) => {
             dispatch(addRating(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         },
         {
           color: 'primary',
           name: 'Co',
           action: (tabId, surveyId) => {
             dispatch(addComment(surveyId));
             dispatch(addSurvey(tabId, surveyId));
           }
         }
       ],
      // handleEditSurvey,
      handleDeleteTab: (tabId, focusId) => {
        dispatch(deleteTab(tabId, focusId));
      },
      handleSurveyMove: (sourceId,targetId, tab) => {
        dispatch(moveSurvey(sourceId, targetId, tab))
      }
    }
}

const SurveyBuilderContainer = compose(
  DragDropContext(HTML5Backend),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyBuilder);

export default SurveyBuilderContainer;