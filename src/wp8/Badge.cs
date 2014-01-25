/*
    Copyright 2013-2014 appPlant UG

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

using System;
using System.Linq;

using Microsoft.Phone.Shell;

using WPCordovaClassLib.Cordova;
using WPCordovaClassLib.Cordova.Commands;
using WPCordovaClassLib.Cordova.JSON;

namespace Cordova.Extension.Commands
{
    public class Badge : BaseCommand
    {
        /// <summary>
        /// Fügt dem Live Tile eine Badge Nummer hinzu
        /// </summary>
        public void setBadge (string badgeNumber)
        {
            // Application Tile is always the first Tile, even if it is not pinned to Start.
            ShellTile TileToFind = ShellTile.ActiveTiles.First();

            // Application should always be found
            if (TileToFind != null)
            {
                string[] args = JsonHelper.Deserialize<string[]>(badgeNumber);
                int count     = 0;

                try
                {
                    count = int.Parse(args[0]);
                }
                catch (FormatException) {};

                StandardTileData TileData = new StandardTileData
                {
                    Count = count
                };

                TileToFind.Update(TileData);

                DispatchCommandResult();
            }
        }
    }
}
