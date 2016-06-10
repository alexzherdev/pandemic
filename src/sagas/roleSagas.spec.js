import { expect } from 'chai';
import { select, put } from 'redux-saga/effects';

import { treatCuredDiseasesOnMedicMove } from './roleSagas';
import { medicTreatCuredDiseases } from '../actions/diseaseActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('RoleSagas', function() {
  describe('treatCuredDiseasesOnMedicMove', () => {
    beforeEach(() => {
      this.generator = treatCuredDiseasesOnMedicMove({ type: types.PLAYER_MOVE_TO_CITY,
        playerId: '1', destinationId: '0' });
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(select(sel.getPlayerRole, '1'));
    });

    it('does not do anything if the player is not a medic', () => {
      this.next = this.generator.next('scientist');
      expect(this.next.done).to.be.true;
    });

    it('treats cured diseases in the city if the player is a medic', () => {
      this.next = this.generator.next('medic');
      expect(this.next.value).to.deep.equal(select(sel.getCuredDiseases));
      this.next = this.generator.next(['red', 'yellow']);
      expect(this.next.value).to.deep.equal(put(medicTreatCuredDiseases('0', ['red', 'yellow'])));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });
});
