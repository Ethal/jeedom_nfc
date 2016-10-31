<?php

/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */
 require_once dirname(__FILE__) . "/../../../../core/php/core.inc.php";

 if (!jeedom::apiAccess(init('apikey'), 'nfc')) {
 	echo __('Clef API non valide, vous n\'êtes pas autorisé à effectuer cette action (nfc)', __FILE__);
 	die();
 }

 $reader = init('name');
 $uid = init('uid');
 $nfc = self::byLogicalId($uid, 'nfc');
 if (!is_object($nfc)) {
   if (config::byKey('include_mode','nfc') != 1) {
     return false;
   }
   $nfc = new nfc();
   $nfc->setEqType_name('nfc');
   $nfc->setLogicalId($uid);
   $nfc->setConfiguration('uid', $uid);
   $nfc->setName($uid);
   $nfc->setIsEnable(true);
   event::add('nfc::includeDevice',
   array(
     'state' => $state
   )
 );
}
$nfc->setConfiguration('lastCommunication', date('Y-m-d H:i:s'));
$nfc->save();
$nfcCmd = nfcCmd::byEqLogicIdAndLogicalId($nfc->getId(),$reader);
if (!is_object($nfcCmd)) {
 $nfcCmd = new nfcCmd();
 $nfcCmd->setName($reader);
 $nfcCmd->setEqLogic_id($nfc->getId());
 $nfcCmd->setLogicalId($reader);
 $nfcCmd->setType('info');
 $nfcCmd->setSubType('binary');
 $nfcCmd->setConfiguration('returnStateValue',0);
 $nfcCmd->setConfiguration('returnStateTime',1);
}
$nfcCmd->setConfiguration('value', 1);
$nfcCmd->setConfiguration('reader', $reader);
$nfcCmd->save();
$nfcCmd->event(1);

 return true;

?>
