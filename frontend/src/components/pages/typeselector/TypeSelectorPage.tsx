
import { PageStepper } from 'components/common/PageStepper';
import React, { useEffect, useState } from 'react';
import './TypeSelectorPage.css';
import { WebsiteBuilderState } from 'state/websiteBuilderState';

interface ISelectorProps {
  imgPath: string,
  isSelected: boolean,
  onClick: () => void,
  label: string,
};

function _Selector({ imgPath, isSelected, label, onClick }: ISelectorProps) {
  return <div className="selector-images-items" style= {{backgroundImage: "url(" + imgPath + ")"}}>
    <button className="selector-images-container" onClick={onClick}>
      <div className="selector-images-container-filter">
         <div className="selector-images-label">{label}</div>
         {isSelected ? <div className="select-label-container-type-selector">Sélectionné</div>:''}
      </div>
    </button>
  </div>;
}

interface IProps {
};

export function TypeSelectorPage({ }: IProps) {
  const {
    category, updateCategory,
    redirectToPrev, redirectToNext,
  } = WebsiteBuilderState.useContainer();

  const [ selectedCategory, setSelectedCategory ] = useState(category as null | string);
  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);
  return <>

    <PageStepper />
    <div className="selector-container-h1">
      <h1 className="selector-h1">Sélectionnez un type d'établissement</h1>
    </div>
    <div style= {{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <div style= {{ display: 'flex', flexDirection: 'row', width: '100%'}}>
        <_Selector imgPath="https://source.unsplash.com/MtqG1lWcUw0" isSelected={selectedCategory === 'restaurant'} label="Restaurant" onClick={() => setSelectedCategory('restaurant')} />
        <_Selector imgPath="https://source.unsplash.com/I8-T4lMCA6k" isSelected={selectedCategory === 'shop'} label="Commerce" onClick={() => setSelectedCategory('shop')} />
      </div>
    </div>
    <div className="main-button-container">
      <div className="main-button-margin">
        <button className="main-button-in-left" onClick={redirectToPrev}>Étape précédente</button>&nbsp;&nbsp;
      </div>
      <div className="main-button-margin">
        <button className="main-button-in-right" disabled={selectedCategory === null} onClick={() => updateCategory(selectedCategory!, redirectToNext)}>Étape suivante</button>
      </div>
    </div>
  </>;
}
