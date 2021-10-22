
import { Button, Grid, Paper } from '@material-ui/core';
import { AttachFile as AttachFileIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";

import UnsplashLogo from 'images/unsplash.png';
import { UnsplashDialog } from './UnsplashDialog';
import { IImgData } from 'core/utils';
import "./ImageSearchBtns.css"

export interface IUnplashImage {
  id: string;
  authorName: string;
  authorUsername: string,
}

interface IProps {
  value: IImgData;
  setValue: (x: IImgData) => void;
};

export function ImageSearchBtns({ value, setValue }: IProps) {

  const [dialogOpen, setDialogOpen] = useState(false);

  function onSelectUnsplash(imgSrc: IUnplashImage) {
    setValue({ img_source: 'unsplash', path: imgSrc.id, authorName: imgSrc.authorName, authorUsername: imgSrc.authorUsername });
    setDialogOpen(false);
  }

  function onSelectFile(image: ImageType) {
    setValue({ img_source: 'file', path: image.dataURL! });
  }

  // TODO: sauter une ligne à partir de 1600px

  return <>
    <UnsplashDialog open={dialogOpen} onClose={() => setDialogOpen(false)} selectImage={onSelectUnsplash} />
    <Grid container spacing={1}>

      <Grid item xs={12} sm={6}>
        <Paper style={{ margin: '10px 0', padding: '16px 10px', textAlign: 'center' }}>
          <ImageUploading
            value={value.img_source === 'file' ? [{ dataURL: value.path }] : []}
            onChange={(imageList: ImageListType) => onSelectFile(imageList[0])}
          >
            {({ onImageUpload, imageList, dragProps }) => <>
              <div {...dragProps}>
                <div style={{ margin: '31px 4px', display: 'flex', flexDirection: 'row' }}>
                  <div style={{ flex: 3 }} />
                  <div style={{ fontWeight: 700 }}><AttachFileIcon style={{ fontSize: 48 }} /></div>
                  <div style={{ flex: 1 }} />
                  <div style={{ fontSize: 36, fontWeight: 700 }}>Fichier</div>
                  <div style={{ flex: 4 }} />
                </div>
                <div>
                  {
                    imageList[0] !== undefined
                    ? <img src={imageList[0].dataURL} alt="" width="100" />
                    : <></>
                  }
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Button variant="contained" onClick={onImageUpload} style={{ fontSize: '10px' }}>Je choisi une photo que j'ai sur mon ordinateur</Button>
                </div>
              </div>
            </>}
          </ImageUploading>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper style={{ margin: '10px 0', padding: '16px 10px', textAlign: 'center' }}>
          <div style={{ margin: '32px 4px'}}>
            <img className="unsplashlogo-img" src={UnsplashLogo} width={200} />
          </div>
          <div>
            {
              value.img_source === 'unsplash'
              ? <img src={`https://source.unsplash.com/${value.path}`} alt="" width="100" />
              : <></>
            }
          </div>
          <div>
            <Button variant="contained" onClick={() => setDialogOpen(true)} style={{ fontSize: '10px' }}>Je choisi une photo parmi celles que vous me proposez gratuitement</Button>
          </div>
        </Paper>
      </Grid>

    </Grid>
  </>;
};
