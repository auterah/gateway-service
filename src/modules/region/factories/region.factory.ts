import { Injectable } from '@nestjs/common';
import { RestcountriesService } from '../providers/restcountries.providers';
import { SetRegionService } from '../interfaces/region_providers';
import { ERegionProviders } from '../enums/region_providers';

/**
 * Factory class responsible for returning a collection of Region API provider classes
 */
@Injectable()
export class RegionFactory {
  repositories: Map<ERegionProviders, SetRegionService>;

  constructor(restcountriesService: RestcountriesService) {
    if (!this.repositories) {
      this.repositories = new Map<ERegionProviders, SetRegionService>();

      this.repositories.set(
        ERegionProviders.Restcountries,
        restcountriesService,
      );
    }
  }

  /**
   * Returns all providers in a map
   */
  public all(): Map<ERegionProviders, SetRegionService> {
    return this.repositories;
  }

  /**
   * Returns a single provider
   */
  public findOne(providerName: ERegionProviders): SetRegionService {
    const provider = this.repositories.get(providerName);

    if (!provider) {
      throw new ReferenceError(
        'Sorry. Region API provider not found in factory',
      );
    }

    return provider;
  }
}
