/* *********************************************
 * @license
 * Copyright (c) 2017-Present lisez <mm4324@gmail.com>
 * All rights reserved. This code is governed by a BSD-style license
 * that can be found in the LICENSE file.
 * version: 1.0-dev
 ***********************************************/

'use strict';

function JDocTbConverter(rawTb){

	if(rawTb==null) return false;

	var regexNotTb		= /[^\u2500-\u257F\s　]/,
		regexTbTr		= /^\s*├/,
		regexTbTd		= /^\s*│/,
		regexTbSplit	= /│/,
		regexTbContent	= /^\s*│(.+)│$/,
		regexBlanks		= /\s+|　/g,
		
		parseCells		= function(row){
			var rowContent = row.match(regexTbContent)[1].replace(regexBlanks, '').trim();
			if(regexTbSplit.test(rowContent)){
				return rowContent.split('│');
			}
			return Array(rowContent);
		};
	
	this.rawTbRows	= rawTb.split('\n');
	this.rawTbLength= this.rawTbRows.length;
	this.rawId		= 0;
	this.storeTb	= [];
	this.storeId	= 0;
	
	for(this.rawId = 0; this.rawId < this.rawTbLength; this.rawId++){
		
		if(regexTbTd.test(this.rawTbRows[this.rawId]) && regexNotTb.test(this.rawTbRows[this.rawId])){
			
			var rowCells		= parseCells(this.rawTbRows[this.rawId]),
				rowCellsLength	= rowCells.length;
			
			for(var rowCellsId = 0; rowCellsId < rowCellsLength; rowCellsId++){

				if(typeof this.storeTb[this.storeId] === 'undefined'){
					this.storeTb[this.storeId] = [];}
				if(typeof this.storeTb[this.storeId][rowCellsId] === 'undefined'){
					this.storeTb[this.storeId][rowCellsId] = '';}
				
				this.storeTb[this.storeId][rowCellsId] += rowCells[rowCellsId].trim();
			}
		}else if(regexTbTr.test(this.rawTbRows[this.rawId])){
			// if it detects '├' that means a new line(<tr>).
			this.storeId += 1;
		}
	}

	return true;
}

JDocTbConverter.prototype.debug = function(){
	console.warn(this.storeTb);
};

JDocTbConverter.prototype.getDOM = function(){
	
	var domTb = document.createElement('table'),
		tbLength = this.storeTb.length;

	for (var indexTr = 0; indexTr < tbLength; indexTr++) {
		var domTr = document.createElement('tr');
		for (var indexTd = 0; indexTd < this.storeTb[indexTr].length; indexTd++) {
			var domTd	= document.createElement('td'),
				tdText	= document.createTextNode(this.storeTb[indexTr][indexTd]);

			domTd.appendChild(tdText);
			domTr.appendChild(domTd);
		}
		domTb.appendChild(domTr);
	}

	return domTb;
};

JDocTbConverter.prototype.getJSON = function(){
	return JSON.stringify(this.storeTb);
};