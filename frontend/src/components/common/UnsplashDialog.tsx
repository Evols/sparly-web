
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';

// @ts-ignore
import Masonry from 'react-responsive-masonry';
import { IUnplashImage } from './ImageSearchBtns';
import './UnsplashDialog.css'

interface IProps {
  open: boolean;
  onClose: () => void;
  selectImage: (imgSrc: IUnplashImage) => void;
};

export function UnsplashDialog({ open, onClose, selectImage }: IProps) {

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<IUnplashImage[]>([]);

  async function search() {
    const res = await axios.get(`/photo/search?s=${encodeURI(searchText)}`);
    const newResults = res.data?.results;
    if (newResults != null) {
      setResults(newResults);
    }
  }

  function onSelectImage(imgSrc: IUnplashImage) {
    selectImage(imgSrc);
    onClose();
  }

  return <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
    <DialogTitle>Tapez un mot clé puis cliquez sur <span className="search-button-unsplash">Rechercher</span> pour trouver la photo qui vous convient</DialogTitle>
    <DialogContent>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TextField placeholder="Recherche d'image" fullWidth value={searchText} onChange={e => setSearchText(e.target.value)} />
          &nbsp;&nbsp;
          <button className="button-search-unsplash" onClick={search}><span className="search-button-unsplash">Rechercher</span></button>
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Masonry gutter="10px" columnsCount={3}>
          { results.map(imgSrc => <img key={imgSrc.id} src={`https://source.unsplash.com/${imgSrc.id}`} width={290} onClick={() => onSelectImage(imgSrc)} />) }
        </Masonry>
      </div>
    </DialogContent>
  </Dialog>;
};
