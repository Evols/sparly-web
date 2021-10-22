
import React from 'react';
import { Button, Paper, TextField } from '@material-ui/core';

import './WebBuilder.css';
import { ImageSearchBtns } from 'components/common/ImageSearchBtns';
import { IFormData, IFormEntryEditable } from 'core/utils';

interface IProps {
  formData: IFormData,
  setFormData: (x: IFormData) => void,
}

export function WebBuilder({ formData, setFormData }: IProps) {

  function updateFormData(key: string, newValue: any) {
    let newFormData = { ...formData };
    // @ts-ignore
    newFormData[key] = { ...formData[key], value: newValue };
    setFormData(newFormData);
  }

  function genFieldFromKey(key: string) {

    const v = formData[key];
    switch (v.type) {

      case 'title':
        return <h2 className="h2builder">{v.label}</h2>;

      case 'string':
        return (
          <div className="textfieldbuilder">
            <TextField
              onChange={e => updateFormData(key, e.target.value) }
              value={v.value}
              label={v.label}
              multiline
              rowsMax={3}
              fullWidth
            />
          </div>
        );

      case 'img':
        return <>
          <div>{v.label}</div>
          <ImageSearchBtns value={v.value} setValue={newVal => updateFormData(key, newVal)} />
        </>;

      case 'array':
        return <>

          {/* Label et bouton "ajouter" */}

          <div style={{ paddingTop: '20px' }}>
            {v.label}&nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              size="small"
              onClick={() => updateFormData(key, [ ...v.value, v.default ])}
            >
              <span style={{ fontSize: 12 }}>
                Ajouter un élément
              </span>
            </Button>
          </div>

          {/* Mapping, et affichage récursif dans un Paper */}

          {
            v.value.map((arrayIt, idx) => (
              <Paper key={idx} style={{ padding: '1px 10px 10px 10px', margin: '12px 0' }}>

                {/* Affichage récursif des données dans le tableau */}
                <WebBuilder
                  formData={arrayIt}
                  setFormData={function(newFormData) {
                    let newArray = [...v.value];
                    newArray[idx] = newFormData;
                    updateFormData(key, newArray);
                  }}
                />

                {/* Bouton pour supprimer l'élément */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => updateFormData(key, v.value.filter((_, u) => u !== idx))}
                  style={{ marginTop: 10 }}
                >
                  <span style={{ fontSize: 12 }}>
                    Supprimer
                  </span>
                </Button>

              </Paper>
            ))
          }

        </>;
    }
  }

  return <>
    {
      Object.keys(formData)
      .map((k) => <React.Fragment key={k}>{genFieldFromKey(k)}</React.Fragment>)
    }
  </>;
};
